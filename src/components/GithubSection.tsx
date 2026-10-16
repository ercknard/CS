'use client';

import * as React from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  created_at: string;
  payload: {
    action?: string;
    member?: {
      login?: string;
      avatar_url?: string;
      html_url?: string;
    };
    commits?: Array<{
      message: string;
      sha?: string;
    }>;
    ref?: string;
    ref_type?: string;
    pull_request?: {
      title: string;
      html_url: string;
    };
    issue?: {
      title: string;
      html_url: string;
    };
    release?: {
      name?: string;
      tag_name?: string;
      html_url?: string;
    };
  };
}

function getActivityDescription(event: GitHubEvent): string {
  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload.commits?.length ?? 0;

      return `pushed ${count} commit${count === 1 ? '' : 's'}`;
    }

    case 'PullRequestEvent':
      return `${event.payload.action ?? 'updated'} a pull request`;

    case 'IssuesEvent':
      return `${event.payload.action ?? 'updated'} an issue`;

    case 'IssueCommentEvent':
      return 'commented on an issue or pull request';

    case 'CreateEvent':
      return `created a ${event.payload.ref_type ?? 'repository'}`;

    case 'WatchEvent':
      return 'starred a repository';

    case 'ForkEvent':
      return 'forked a repository';

    case 'DeleteEvent':
      return `deleted a ${event.payload.ref_type ?? 'reference'}`;

    case 'ReleaseEvent':
      return 'published a release';

    case 'MemberEvent': {
      const action = event.payload.action ?? 'updated';
      const member = event.payload.member?.login;

      return `${action} ${member ? `@${member}` : 'an organization member'}`;
    }

    case 'PublicEvent':
      return 'made a repository public';

    case 'GollumEvent':
      return 'updated repository documentation';

    default:
      return event.type
        .replace(/Event$/, '')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}

function getActivityTitle(event: GitHubEvent): string {
  switch (event.type) {
    case 'PushEvent':
      return event.payload.commits?.[0]?.message ?? 'Pushed commits';

    case 'PullRequestEvent':
      return event.payload.pull_request?.title ?? 'Pull request';

    case 'IssuesEvent':
      return event.payload.issue?.title ?? 'Issue';

    case 'ReleaseEvent':
      return (
        event.payload.release?.name ??
        event.payload.release?.tag_name ??
        'View release'
      );

    case 'CreateEvent':
      return event.payload.ref ?? event.repo.name;

    default:
      return event.repo.name;
  }
}

function getActivityUrl(event: GitHubEvent): string {
  if (
    event.type === 'PullRequestEvent' &&
    event.payload.pull_request?.html_url
  ) {
    return event.payload.pull_request.html_url;
  }

  if (event.type === 'IssuesEvent' && event.payload.issue?.html_url) {
    return event.payload.issue.html_url;
  }

  if (event.type === 'ReleaseEvent' && event.payload.release?.html_url) {
    return event.payload.release.html_url;
  }

  if (event.type === 'PushEvent' && event.payload.commits?.[0]?.sha) {
    return `https://github.com/${event.repo.name}/commit/${event.payload.commits[0].sha}`;
  }

  return `https://github.com/${event.repo.name}`;
}

function formatActivityDate(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export default function GitHubSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const primary = theme.colorScale?.[9] ?? theme.palette.primary.main;
  const secondary = theme.secondaryScale?.[9] ?? theme.palette.secondary.main;
  const background =
    theme.backgroundScale?.[1] ?? theme.palette.background.default;
  const surface = theme.secondaryScale?.[4] ?? theme.palette.background.paper;
  const textPrimary = theme.grayScale?.[12] ?? theme.palette.text.primary;
  const textSecondary = theme.grayScale?.[10] ?? theme.palette.text.secondary;

  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim();

  const [activities, setActivities] = React.useState<GitHubEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activityError, setActivityError] = React.useState('');

  const fetchActivity = React.useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setActivityError('');

      const response = await fetch('/api/github/events?per_page=100', {
        signal,
        cache: 'no-store',
        headers: {
          Accept: 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ??
            data?.error ??
            `Unable to load GitHub activity (HTTP ${response.status}).`
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          data?.message ??
            data?.error ??
            'The GitHub API returned an invalid activity response.'
        );
      }

      // Preserve every event returned by the organization API.
      // Do not filter by event type or truncate the list.
      const recentEvents = (data as GitHubEvent[])
        .filter(
          (event) =>
            event &&
            typeof event.id === 'string' &&
            typeof event.type === 'string' &&
            typeof event.created_at === 'string' &&
            event.repo?.name &&
            event.actor?.login
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);

      if (signal?.aborted) return;

      setActivities(recentEvents);
    } catch (error) {
      if (signal?.aborted) return;

      setActivityError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while loading GitHub activity.'
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();

    void fetchActivity(controller.signal);

    return () => controller.abort();
  }, [fetchActivity]);

  const profileUrl = username
    ? `https://github.com/${encodeURIComponent(username)}`
    : 'https://github.com/orgs/Cryptech-Services';

  return (
    <Box
      component="section"
      id="github"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        py: { xs: 9, sm: 12, md: 16 },
        color: textPrimary,
        bgcolor: background,
        backgroundImage: `
          radial-gradient(
            ellipse at 15% 45%,
            ${alpha(primary, isDark ? 0.12 : 0.07)} 0%,
            transparent 48%
          ),
          radial-gradient(
            ellipse at 90% 80%,
            ${alpha(secondary, isDark ? 0.1 : 0.06)} 0%,
            transparent 42%
          )
        `
      }}
    >
      {/* Decorative grid */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          opacity: isDark ? 0.2 : 0.12,
          backgroundImage: `
            linear-gradient(${alpha(textSecondary, 0.15)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(textSecondary, 0.15)} 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
        }}
      />

      {/* Animated technology and code SVG background */}
      <Box
        component="svg"
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: isDark ? 0.2 : 0.22,
          overflow: 'hidden',
          '& .circuit-line': {
            fill: 'none',
            stroke: primary,
            strokeWidth: 1.2,
            strokeLinecap: 'round',
            strokeDasharray: '7 14',
            animation: 'github-circuit-flow 22s linear infinite'
          },
          '& .circuit-line-secondary': {
            fill: 'none',
            stroke: secondary,
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeDasharray: '3 12',
            animation: 'github-circuit-flow 30s linear infinite reverse'
          },
          '& .code-label': {
            fill: textSecondary,
            fontFamily: 'monospace',
            fontSize: 18,
            opacity: 0.7,
            animation: 'github-code-float 12s ease-in-out infinite'
          },
          '& .code-label:nth-of-type(2n)': {
            animationDelay: '-5s'
          },
          '& .node': {
            fill: background,
            stroke: primary,
            strokeWidth: 2,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: 'github-node-pulse 4s ease-in-out infinite'
          },
          '@keyframes github-circuit-flow': {
            from: { strokeDashoffset: 0 },
            to: { strokeDashoffset: -420 }
          },
          '@keyframes github-code-float': {
            '0%, 100%': { transform: 'translateY(0px)', opacity: 0.35 },
            '50%': { transform: 'translateY(-16px)', opacity: 0.8 }
          },
          '@keyframes github-node-pulse': {
            '0%, 100%': { opacity: 0.45, transform: 'scale(0.85)' },
            '50%': { opacity: 1, transform: 'scale(1.15)' }
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& .circuit-line, & .circuit-line-secondary, & .code-label, & .node':
              {
                animation: 'none'
              }
          }
        }}
      >
        <defs>
          <linearGradient
            id="github-circuit-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor={primary} stopOpacity="0.08" />
            <stop offset="50%" stopColor={primary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="github-node-glow">
            <stop offset="0%" stopColor={primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={primary} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g opacity="0.8">
          <path
            className="circuit-line"
            stroke="url(#github-circuit-gradient)"
            d="M-40 180 H190 L250 240 H420 L480 180 H680 L735 235 H900 L965 170 H1160 L1220 230 H1480"
          />
          <path
            className="circuit-line-secondary"
            d="M-30 650 H160 L220 590 H390 L450 650 H620 L680 590 H850 L910 650 H1090 L1150 590 H1480"
          />
          <path
            className="circuit-line"
            d="M160 -30 V120 L220 180 V330 L160 390 V520 L220 580 V760 L160 820 V940"
          />
          <path
            className="circuit-line-secondary"
            d="M1250 -30 V110 L1190 170 V330 L1250 390 V540 L1190 600 V780 L1250 840 V940"
          />
          <path
            className="circuit-line"
            d="M430 900 V790 L490 730 V540 L550 480 V360 L610 300 V-30"
          />
          <path
            className="circuit-line-secondary"
            d="M990 900 V780 L930 720 V500 L870 440 V300 L810 240 V-30"
          />
        </g>

        <g>
          {[
            [190, 180],
            [250, 240],
            [420, 240],
            [480, 180],
            [735, 235],
            [965, 170],
            [1220, 230],
            [160, 390],
            [220, 580],
            [450, 650],
            [680, 590],
            [910, 650],
            [1150, 590],
            [430, 540],
            [990, 500]
          ].map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="18" fill="url(#github-node-glow)" />
              <circle
                className="node"
                cx={cx}
                cy={cy}
                r={index % 3 === 0 ? 4 : 2.5}
              />
            </g>
          ))}
        </g>

        <g className="code-label">
          <text x="300" y="115">
            {'{ }'}
          </text>
          <text x="520" y="320">
            {'const build = () => ...'}
          </text>
          <text x="760" y="145">
            {'< / >'}
          </text>
          <text x="1030" y="365">
            {'git commit -m "ship"'}
          </text>
          <text x="280" y="740">
            {'function create() {'}
          </text>
          <text x="700" y="810">
            {'0101 1010 0011'}
          </text>
          <text x="1080" y="720">
            {'API  /  NODE  /  CODE'}
          </text>
          <text x="65" y="490">
            {'[ ] => { }'}
          </text>
          <text x="1310" y="465">
            {'</>'}
          </text>
        </g>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          spacing={{ xs: 5, md: 7 }}
          sx={{
            width: '100%',
            alignItems: 'center'
          }}
        >
          {/* Section heading */}
          <Stack
            spacing={2.5}
            sx={{
              width: '100%',
              maxWidth: 780,
              mx: 'auto',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Chip
              icon={<GitHubIcon sx={{ fontSize: 17 }} />}
              label="BUILT IN THE OPEN"
              variant="outlined"
              sx={{
                color: primary,
                borderColor: alpha(primary, 0.35),
                bgcolor: alpha(primary, 0.06),
                fontWeight: 700,
                letterSpacing: '0.12em',
                fontSize: '0.68rem',
                '& .MuiChip-icon': {
                  color: primary
                }
              }}
            />

            <Typography
              component="h2"
              variant="h2"
              sx={{
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: '-0.055em'
              }}
            >
              Code that moves
              <Box
                component="span"
                sx={{
                  display: 'block',
                  color: primary
                }}
              >
                ideas forward.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                color: textSecondary,
                lineHeight: 1.85,
                fontSize: { xs: '0.98rem', md: '1.1rem' }
              }}
            >
              Explore our work on GitHub. From development tools to experiments
              and open-source projects, discover the code behind what we build.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{
                pt: 1,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <Button
                component="a"
                href="https://github.com/orgs/Cryptech-Services"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                startIcon={<GitHubIcon />}
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{
                  minHeight: 50,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Explore GitHub
              </Button>

              <Button
                component="a"
                href="https://github.com/orgs/Cryptech-Services"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<StarRoundedIcon />}
                sx={{
                  minHeight: 50,
                  px: 3,
                  borderRadius: 2,
                  borderColor: alpha(textSecondary, 0.3),
                  color: textPrimary,
                  textTransform: 'none',
                  fontWeight: 700
                }}
              >
                Support Our Work
              </Button>
            </Stack>
          </Stack>

          {/* Recent activity feed */}
          <Paper
            variant="outlined"
            sx={{
              maxWidth: 900,
              width: '100%',
              mx: 'auto',
              alignSelf: 'center',
              boxSizing: 'border-box',
              overflow: 'hidden',
              borderRadius: 3,
              bgcolor: surface,
              borderColor: alpha(textSecondary, 0.18),
              backdropFilter: 'blur(12px)'
            }}
          >
            {/* Feed header */}
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2, sm: 3 },
                py: 2,
                borderBottom: `1px solid ${alpha(textSecondary, 0.16)}`
              }}
              spacing={2}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ minWidth: 0, alignItems: 'center' }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 2,
                    color: primary,
                    bgcolor: alpha(primary, 0.1)
                  }}
                >
                  <GitHubIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 750 }}>
                    Organization activity
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: textSecondary,
                      overflowWrap: 'anywhere'
                    }}
                  >
                    Cryptech-Services · Public events
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: 'center' }}
              >
                <Button
                  onClick={() => void fetchActivity()}
                  disabled={loading}
                  aria-label="Refresh GitHub activity"
                  title="Refresh activity"
                  sx={{
                    minWidth: 38,
                    width: 38,
                    height: 38,
                    p: 0,
                    color: textSecondary
                  }}
                >
                  <RefreshRoundedIcon
                    sx={{
                      animation: loading
                        ? 'github-spin 1s linear infinite'
                        : 'none',
                      '@keyframes github-spin': {
                        from: { transform: 'rotate(0deg)' },
                        to: { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                </Button>

                <Button
                  component="a"
                  href="https://github.com/orgs/Cryptech-Services"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    textTransform: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  View organization
                </Button>
              </Stack>
            </Stack>

            {/* Loading state */}
            {loading && activities.length === 0 && (
              <Stack spacing={2} sx={{ py: 6, px: 2, alignItems: 'center' }}>
                <CircularProgress size={28} />
                <Typography variant="body2" sx={{ color: textSecondary }}>
                  Loading organization activity…
                </Typography>
              </Stack>
            )}

            {/* Error state */}
            {!loading && activityError && activities.length === 0 && (
              <Stack spacing={1.5} sx={{ py: 5, px: 3, alignItems: 'center' }}>
                <GitHubIcon
                  sx={{
                    fontSize: 34,
                    color: textSecondary
                  }}
                />

                <Typography
                  sx={{
                    color: textSecondary,
                    textAlign: 'center',
                    maxWidth: 520
                  }}
                >
                  {activityError}
                </Typography>

                <Button
                  onClick={() => void fetchActivity()}
                  startIcon={<RefreshRoundedIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Try again
                </Button>
              </Stack>
            )}

            {/* Empty state */}
            {!loading && !activityError && activities.length === 0 && (
              <Stack spacing={1} sx={{ py: 5, px: 3, alignItems: 'center' }}>
                <GitHubIcon
                  sx={{
                    fontSize: 34,
                    color: textSecondary
                  }}
                />
                <Typography sx={{ color: textSecondary, textAlign: 'center' }}>
                  No recent public organization activity found.
                </Typography>
              </Stack>
            )}

            {/* All activity entries returned by the API */}
            {activities.length > 0 && (
              <Stack
                divider={
                  <Box
                    sx={{
                      borderBottom: `1px solid ${alpha(textSecondary, 0.12)}`
                    }}
                  />
                }
              >
                {activities.map((event) => (
                  <Stack
                    key={`${event.id}-${event.repo.name}`}
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'flex-start',
                      px: { xs: 2, sm: 3 },
                      py: 2.5,
                      transition: 'background-color 160ms ease',
                      '&:hover': {
                        bgcolor: alpha(primary, 0.04)
                      }
                    }}
                  >
                    <Avatar
                      src={event.actor.avatar_url}
                      alt={event.actor.login}
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0
                      }}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          lineHeight: 1.7,
                          overflowWrap: 'anywhere'
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 750 }}>
                          {event.actor.login}
                        </Box>{' '}
                        <Box component="span" sx={{ color: textSecondary }}>
                          {getActivityDescription(event)}
                        </Box>
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          color: textSecondary,
                          overflowWrap: 'anywhere'
                        }}
                      >
                        {event.repo.name}
                      </Typography>

                      <MuiLink
                        href={getActivityUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="inherit"
                        sx={{
                          display: 'inline-block',
                          mt: 0.5,
                          fontWeight: 650,
                          fontSize: '0.88rem',
                          overflowWrap: 'anywhere',
                          '&:hover': {
                            color: primary
                          }
                        }}
                      >
                        {getActivityTitle(event)}
                      </MuiLink>

                      <Typography
                        component="time"
                        dateTime={event.created_at}
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.75,
                          color: textSecondary
                        }}
                      >
                        {formatActivityDate(event.created_at)}
                      </Typography>
                    </Box>

                    <GitHubIcon
                      sx={{
                        mt: 0.5,
                        fontSize: 19,
                        flexShrink: 0,
                        color: textSecondary
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            )}

            {/* Refreshing indicator */}
            {loading && activities.length > 0 && (
              <Box
                sx={{
                  px: 3,
                  py: 1,
                  borderTop: `1px solid ${alpha(textSecondary, 0.12)}`
                }}
              >
                <Typography variant="caption" sx={{ color: textSecondary }}>
                  Refreshing activity…
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Footer note */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{
              color: textSecondary,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <CodeRoundedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              Open source, shared knowledge, and continuous improvement.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
