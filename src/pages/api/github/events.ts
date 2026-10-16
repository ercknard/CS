import type { NextApiRequest, NextApiResponse } from 'next';

interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
    url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: Record<string, any>;
  public: boolean;
  created_at: string;
  org?: {
    login: string;
    avatar_url?: string;
  };
}

interface GitHubError {
  message: string;
}

const ORGANIZATION = 'Cryptech-Services';
const GITHUB_API = 'https://api.github.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubEvent[] | GitHubError>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');

    return res.status(405).json({
      message: 'Method not allowed.'
    });
  }

  const token = process.env.GITHUB_TOKEN;
  const requestedLimit = Number(req.query.per_page ?? 100);
  const perPage = Number.isFinite(requestedLimit)
    ? Math.min(100, Math.max(1, Math.floor(requestedLimit)))
    : 100;

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Fetch multiple pages of organization-wide activity.
    const pages = await Promise.all(
      [1, 2, 3].map(async (page) => {
        const url = new URL(`${GITHUB_API}/orgs/${ORGANIZATION}/events`);

        url.searchParams.set('per_page', String(perPage));
        url.searchParams.set('page', String(page));

        const response = await fetch(url.toString(), {
          headers
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({
            message: 'GitHub API request failed.'
          }));

          throw Object.assign(
            new Error(error.message || 'GitHub API request failed.'),
            {
              status: response.status,
              rateLimitRemaining: response.headers.get('x-ratelimit-remaining'),
              rateLimitReset: response.headers.get('x-ratelimit-reset')
            }
          );
        }

        return (await response.json()) as GitHubEvent[];
      })
    );

    const events = pages
      .flat()
      .filter(
        (event, index, all) =>
          all.findIndex((item) => item.id === event.id) === index
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json(events);
  } catch (error) {
    const err = error as Error & {
      status?: number;
      rateLimitRemaining?: string | null;
      rateLimitReset?: string | null;
    };

    if (err.rateLimitRemaining === '0' && err.rateLimitReset) {
      res.setHeader('X-GitHub-RateLimit-Reset', err.rateLimitReset);
    }

    console.error('[GitHub organization events]', err.message);

    return res.status(err.status ?? 500).json({
      message: err.message || 'Failed to fetch organization activities.'
    });
  }
}
