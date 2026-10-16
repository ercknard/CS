import type { NextApiRequest, NextApiResponse } from 'next';

const GITHUB_API = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';

const ZERO_SHA = '0000000000000000000000000000000000000000';

type GitHubCommit = {
  sha: string;
  message: string;
  author?: {
    name?: string;
    email?: string;
  };
  distinct?: boolean;
  url?: string;
};

type GitHubEvent = {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login?: string;
    avatar_url: string;
    html_url?: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    master_branch?: string;
    description?: string | null;
    before?: string;
    head?: string;
    commits?: GitHubCommit[];
    [key: string]: unknown;
  };
  public: boolean;
  created_at: string;
};

type GitHubCompareResponse = {
  commits?: Array<{
    sha: string;
    html_url?: string;
    commit?: {
      message?: string;
      author?: {
        name?: string;
        email?: string;
      } | null;
    };
  }>;
};

type GitHubApiError = {
  message?: string;
  documentation_url?: string;
};

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,

    ...(token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {})
  };
}

function getGitHubUrl(owner: string, repo: string, path: string) {
  return `${GITHUB_API}/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}${path}`;
}

function normalizeCommit(
  commit: {
    sha: string;
    html_url?: string;
    commit?: {
      message?: string;
      author?: {
        name?: string;
        email?: string;
      } | null;
    };
  },
  owner: string,
  repo: string
): GitHubCommit {
  return {
    sha: commit.sha,
    message: commit.commit?.message || '',
    author: {
      name: commit.commit?.author?.name,
      email: commit.commit?.author?.email
    },
    distinct: true,
    url:
      commit.html_url ||
      `https://github.com/${owner}/${repo}/commit/${commit.sha}`
  };
}

async function enrichPushEvent(
  event: GitHubEvent,
  owner: string,
  repo: string
): Promise<GitHubEvent> {
  if (event.type !== 'PushEvent') {
    return event;
  }

  const existingCommits = event.payload.commits;

  /*
   * GitHub sometimes includes the commits directly in the event.
   * Use them when they are available instead of making another API call.
   */
  if (Array.isArray(existingCommits) && existingCommits.length > 0) {
    return event;
  }

  const before = event.payload.before;
  const head = event.payload.head;

  if (!head) {
    return event;
  }

  /*
   * A branch creation/deletion can have a zero SHA.
   * There is nothing useful to compare in that situation.
   */
  if (!before || before === ZERO_SHA) {
    return event;
  }

  try {
    const compareUrl = getGitHubUrl(
      owner,
      repo,
      `/compare/${encodeURIComponent(before)}...${encodeURIComponent(head)}`
    );

    const response = await fetch(compareUrl, {
      headers: githubHeaders()
    });

    if (!response.ok) {
      return event;
    }

    const data = (await response.json()) as GitHubCompareResponse;

    if (!Array.isArray(data.commits) || data.commits.length === 0) {
      return event;
    }

    const commits = data.commits.map((commit) =>
      normalizeCommit(commit, owner, repo)
    );

    return {
      ...event,
      payload: {
        ...event.payload,
        commits
      }
    };
  } catch (error) {
    console.error(`Failed to enrich push event ${event.id}:`, error);

    return event;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);

    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    return res.status(500).json({
      error: 'GITHUB_REPOSITORY is not configured'
    });
  }

  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    return res.status(500).json({
      error: 'GITHUB_REPOSITORY must use the format owner/repository'
    });
  }

  try {
    const perPage = Math.min(Math.max(Number(req.query.per_page) || 10, 1), 10);

    const eventsUrl = 'https://api.github.com/orgs/Cryptech-Services/events';

    const url = new URL(eventsUrl);

    url.searchParams.set('per_page', String(perPage));

    const eventsResponse = await fetch(url.toString(), {
      headers: githubHeaders()
    });

    const eventsData = (await eventsResponse.json()) as
      GitHubEvent[] | GitHubApiError;

    if (!eventsResponse.ok) {
      const message =
        !Array.isArray(eventsData) && eventsData.message
          ? eventsData.message
          : 'GitHub events request failed';

      /*
       * GitHub returns 403 when the API rate limit has been exceeded.
       * Preserve that status so the frontend can show an appropriate
       * message instead of treating it as a generic server failure.
       */
      if (eventsResponse.status === 403) {
        return res.status(403).json({
          error: message,
          status: 403,
          rateLimited: true
        });
      }

      return res.status(eventsResponse.status).json({
        error: message,
        status: eventsResponse.status
      });
    }

    const events: GitHubEvent[] = Array.isArray(eventsData) ? eventsData : [];

    /*
     * Only enrich PushEvents where GitHub didn't provide commits.
     *
     * We intentionally do this sequentially instead of Promise.all()
     * so a page containing many PushEvents cannot suddenly generate
     * 20–30 simultaneous GitHub API requests.
     */
    const enrichedEvents: GitHubEvent[] = [];

    for (const event of events) {
      const enrichedEvent = await enrichPushEvent(event, owner, repo);

      enrichedEvents.push(enrichedEvent);
    }

    /*
     * Always show the newest activity first.
     */
    enrichedEvents.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    /*
     * Vercel/CDN cache:
     *
     * - Cache for 60 seconds.
     * - If GitHub temporarily fails, serve the cached response for
     *   up to another 5 minutes while revalidation happens.
     */
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    /*
     * Useful debugging information without exposing the token.
     */
    res.setHeader(
      'X-GitHub-Authenticated',
      process.env.GITHUB_TOKEN ? 'true' : 'false'
    );

    return res.status(200).json(enrichedEvents);
  } catch (error) {
    console.error('GitHub events error:', error);

    return res.status(500).json({
      error: 'Failed to fetch GitHub events'
    });
  }
}
