'use client';

import * as React from 'react';

import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Chip,
  Pagination,
  Collapse,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';

import { alpha } from '@mui/material/styles';

import { useMediaQuery } from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PageviewRoundedIcon from '@mui/icons-material/PageviewRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchProjects, type Project } from '@/lib/fectProjectsSupabase';

import supabase from '@/lib/supabase';

type ProjectsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  projects?: Project[];
};

type CustomTheme = ReturnType<typeof useTheme> & {
  colorScale?: string[];
  secondaryScale?: string[];
  backgroundScale?: string[];
  grayScale?: string[];
};

type SmallProject = {
  id: number;
  project_name: string;
  project_link: string | null;
  project_desc: string | null;
};

type SelectedProject =
  | { kind: 'flagship'; project: Project }
  | { kind: 'small'; project: SmallProject }
  | null;

const filters = ['All', 'Web Development', 'Web3', 'Design', 'Game Servers'];

const PROJECTS_PER_PAGE = 3;
const SMALL_PROJECTS_PER_PAGE = 4;

export default function Projects({
  eyebrow = 'FLAGSHIP PROJECTS',
  title = 'Building what comes next.',
  description = 'Explore our work across blockchain innovation, decentralized governance, Web3 applications, and scalable interface engineering.',
  projects: providedProjects
}: ProjectsProps) {
  const theme = useTheme();
  const customTheme = theme;
  const isDark = theme.palette.mode === 'dark';

  // Flagship projects
  const [supabaseProjects, setSupabaseProjects] = React.useState<Project[]>(
    providedProjects ?? []
  );

  const [loading, setLoading] = React.useState(providedProjects === undefined);
  const [loadError, setLoadError] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  // Small projects
  const [smallProjects, setSmallProjects] = React.useState<SmallProject[]>([]);
  const [smallProjectsLoading, setSmallProjectsLoading] = React.useState(true);
  const [smallProjectsError, setSmallProjectsError] = React.useState(false);
  const [smallProjectsReloadKey, setSmallProjectsReloadKey] = React.useState(0);

  // Small projects collapsible state
  const [smallProjectsExpanded, setSmallProjectsExpanded] =
    React.useState(false);

  // Project details modal
  const [selectedProject, setSelectedProject] =
    React.useState<SelectedProject>(null);

  const handleOpenFlagshipDetails = React.useCallback((project: Project) => {
    setSelectedProject({ kind: 'flagship', project });
  }, []);

  const handleOpenSmallDetails = React.useCallback((project: SmallProject) => {
    setSelectedProject({ kind: 'small', project });
  }, []);

  const handleCloseDetails = React.useCallback(() => {
    setSelectedProject(null);
  }, []);

  // Independent filters and pagination
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [page, setPage] = React.useState(1);
  const [smallProjectsPage, setSmallProjectsPage] = React.useState(1);

  // Load flagship projects
  React.useEffect(() => {
    if (providedProjects !== undefined) {
      setSupabaseProjects(providedProjects);
      setLoading(false);
      setLoadError(false);
      return;
    }

    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setLoadError(false);

      try {
        const data = await fetchProjects();

        if (!cancelled) {
          setSupabaseProjects(data);
        }
      } catch (error) {
        console.error('Unable to load projects from Supabase:', error);

        if (!cancelled) {
          setSupabaseProjects([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [providedProjects, reloadKey]);

  // Load small projects
  React.useEffect(() => {
    let cancelled = false;

    async function loadSmallProjects() {
      setSmallProjectsLoading(true);
      setSmallProjectsError(false);

      try {
        const { data, error } = await supabase
          .from('ztable_otherprojects')
          .select('id, project_name, project_link, project_desc')
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setSmallProjects((data ?? []) as SmallProject[]);
        }
      } catch (error) {
        console.error('Unable to load small projects:', error);

        if (!cancelled) {
          setSmallProjects([]);
          setSmallProjectsError(true);
        }
      } finally {
        if (!cancelled) {
          setSmallProjectsLoading(false);
        }
      }
    }

    void loadSmallProjects();

    return () => {
      cancelled = true;
    };
  }, [smallProjectsReloadKey]);

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleSmallProjectsRetry = () => {
    setSmallProjectsReloadKey((current) => current + 1);
  };

  const projects = providedProjects ?? supabaseProjects;

  const primary = customTheme.colorScale?.[9] ?? theme.palette.primary.main;

  const secondary =
    customTheme.secondaryScale?.[9] ?? theme.palette.secondary.main;

  const headingColor =
    customTheme.grayScale?.[12] ?? theme.palette.text.primary;

  const mutedColor =
    customTheme.grayScale?.[10] ?? theme.palette.text.secondary;

  const surface =
    customTheme.secondaryScale?.[3] ?? theme.palette.background.default;

  const cardSurface =
    customTheme.backgroundScale?.[3] ?? theme.palette.background.paper;

  const borderColor = alpha(headingColor, isDark ? 0.16 : 0.12);

  // Filter flagship projects
  const filteredProjects = React.useMemo(
    () =>
      projects.filter((project) => {
        if (activeFilter === 'All') return true;

        if (activeFilter === 'Web Development') {
          return project.type === 'web';
        }

        if (activeFilter === 'Web3') {
          return project.type === 'web3';
        }

        if (activeFilter === 'Design') {
          return project.type === 'design';
        }

        if (activeFilter === 'Game Servers') {
          return project.type === 'game';
        }

        return true;
      }),
    [projects, activeFilter]
  );

  // Flagship pagination
  const pageCount = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const visibleProjects = filteredProjects.slice(
    (page - 1) * PROJECTS_PER_PAGE,
    page * PROJECTS_PER_PAGE
  );

  React.useEffect(() => {
    setPage((currentPage) =>
      Math.min(Math.max(currentPage, 1), Math.max(pageCount, 1))
    );
  }, [pageCount]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Small project pagination
  const smallProjectsPageCount = Math.ceil(
    smallProjects.length / SMALL_PROJECTS_PER_PAGE
  );

  const visibleSmallProjects = smallProjects.slice(
    (smallProjectsPage - 1) * SMALL_PROJECTS_PER_PAGE,
    smallProjectsPage * SMALL_PROJECTS_PER_PAGE
  );

  React.useEffect(() => {
    setSmallProjectsPage((currentPage) =>
      Math.min(Math.max(currentPage, 1), Math.max(smallProjectsPageCount, 1))
    );
  }, [smallProjectsPageCount]);

  const handleSmallProjectsPageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSmallProjectsPage(value);
  };

  return (
    <Box
      component="section"
      id="work"
      aria-labelledby="projects-heading"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 9, md: 14 },
        bgcolor: surface,
        color: headingColor
      }}
    >
      {/* Ambient background */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: -240,
          left: '-15%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          display: { xs: 'none', md: 'block' },
          background: `radial-gradient(
            circle,
            ${alpha(secondary, isDark ? 0.1 : 0.07)},
            transparent 70%
          )`,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        {/* Flagship projects heading */}
        <Stack
          spacing={2.5}
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mb: { xs: 4, md: 6 },
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 26,
                height: 2,
                bgcolor: primary,
                borderRadius: 2
              }}
            />

            <Typography
              sx={{
                color: primary,
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.16em'
              }}
            >
              {eyebrow}
            </Typography>

            <Box
              sx={{
                width: 26,
                height: 2,
                bgcolor: secondary,
                borderRadius: 2
              }}
            />
          </Stack>

          <Typography
            id="projects-heading"
            component="h2"
            variant="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.055em',
              lineHeight: 1.12,
              textWrap: 'balance'
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: mutedColor,
              fontSize: { xs: '0.98rem', md: '1.05rem' },
              lineHeight: 1.9,
              maxWidth: 650
            }}
          >
            {description}
          </Typography>
        </Stack>

        {/* Category filters */}
        <Stack
          direction="row"
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            mb: { xs: 4, md: 6 }
          }}
        >
          {filters.map((filter) => {
            const selected = activeFilter === filter;

            return (
              <Button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                variant={selected ? 'contained' : 'outlined'}
                aria-pressed={selected}
                sx={{
                  px: 2,
                  py: 0.9,
                  minWidth: 0,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 650,
                  borderColor: selected ? 'transparent' : alpha(secondary, 0.3),
                  color: selected ? '#FFFFFF' : mutedColor,
                  background: selected
                    ? `linear-gradient(110deg, ${primary}, ${secondary})`
                    : alpha(secondary, isDark ? 0.035 : 0.02),
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: alpha(primary, 0.65),
                    background: selected
                      ? `linear-gradient(110deg, ${primary}, ${secondary})`
                      : alpha(primary, isDark ? 0.12 : 0.07),
                    boxShadow: 'none'
                  }
                }}
              >
                {filter}
              </Button>
            );
          })}
        </Stack>

        {/* Flagship project cards */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {loading && (
            <Grid size={{ xs: 12 }}>
              <Box
                role="status"
                sx={{
                  py: 8,
                  textAlign: 'center',
                  color: mutedColor
                }}
              >
                <Typography sx={{ fontWeight: 650 }}>
                  Loading projects...
                </Typography>
              </Box>
            </Grid>
          )}

          {!loading && loadError && (
            <Grid size={{ xs: 12 }}>
              <Box
                role="alert"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: { xs: 7, md: 9 },
                  px: 3,
                  border: `1px dashed ${borderColor}`,
                  borderRadius: '24px',
                  bgcolor: alpha(cardSurface, isDark ? 0.45 : 0.6),
                  textAlign: 'center'
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    mb: 0.8,
                    color: headingColor,
                    fontSize: '1.05rem',
                    fontWeight: 750,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Unable to load projects
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 340,
                    mb: 2.5,
                    color: mutedColor,
                    fontSize: '0.875rem',
                    lineHeight: 1.8
                  }}
                >
                  We couldn&apos;t retrieve the projects right now. Please try
                  again.
                </Typography>

                <Button
                  variant="outlined"
                  onClick={handleRetry}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: '10px',
                    borderColor: alpha(secondary, 0.3),
                    color: headingColor,
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: alpha(primary, 0.65),
                      bgcolor: alpha(primary, 0.07)
                    }
                  }}
                >
                  Retry
                </Button>
              </Box>
            </Grid>
          )}

          {!loading &&
            !loadError &&
            visibleProjects.map((project) => (
              <Grid
                key={project.number}
                size={{
                  xs: 12,
                  md: project.featured ? 12 : 6,
                  lg: project.featured ? 12 : 4
                }}
              >
                <ProjectCard
                  project={project}
                  primary={primary}
                  secondary={secondary}
                  isDark={isDark}
                  headingColor={headingColor}
                  mutedColor={mutedColor}
                  cardSurface={cardSurface}
                  borderColor={borderColor}
                  onOpenDetails={() => handleOpenFlagshipDetails(project)}
                />
              </Grid>
            ))}

          {!loading && !loadError && filteredProjects.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: { xs: 7, md: 9 },
                  px: 3,
                  border: `1px dashed ${borderColor}`,
                  borderRadius: '24px',
                  bgcolor: alpha(cardSurface, isDark ? 0.45 : 0.6),
                  textAlign: 'center'
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 52,
                    height: 52,
                    mb: 2,
                    borderRadius: '16px',
                    color: mutedColor,
                    bgcolor: alpha(headingColor, isDark ? 0.06 : 0.035),
                    border: `1px solid ${borderColor}`
                  }}
                >
                  <PageviewRoundedIcon sx={{ fontSize: 32 }} />
                </Box>

                <Typography
                  component="h3"
                  sx={{
                    mb: 0.8,
                    color: headingColor,
                    fontSize: '1.05rem',
                    fontWeight: 750,
                    letterSpacing: '-0.02em'
                  }}
                >
                  No projects found
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 340,
                    color: mutedColor,
                    fontSize: '0.875rem',
                    lineHeight: 1.8
                  }}
                >
                  There are no projects in this category yet. Try selecting
                  another category to explore more work.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Flagship project pagination */}
        {!loading && !loadError && pageCount > 1 && (
          <Stack
            spacing={1.5}
            sx={{
              alignItems: 'center',
              mt: { xs: 5, md: 6 }
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
              siblingCount={1}
              boundaryCount={1}
              aria-label="Project pages"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 700,
                  borderRadius: 2
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  boxShadow: `0 0 18px ${alpha(
                    theme.palette.primary.main,
                    0.18
                  )}`
                }
              }}
            />

            <Typography
              sx={{
                fontSize: '0.75rem',
                color: mutedColor,
                textAlign: 'center'
              }}
              aria-live="polite"
            >
              Showing {(page - 1) * PROJECTS_PER_PAGE + 1}–
              {Math.min(page * PROJECTS_PER_PAGE, filteredProjects.length)} of{' '}
              {filteredProjects.length} projects
            </Typography>
          </Stack>
        )}

        {/* COLLAPSIBLE SMALL PROJECTS SECTION */}
        <Box
          component="section"
          id="small-projects"
          aria-labelledby="small-projects-heading"
          sx={{
            mt: { xs: 10, md: 5 },
            pt: { xs: 4, md: 5 },
            borderTop: `1px solid ${borderColor}`
          }}
        >
          {/* Clickable heading */}
          <Box
            component="button"
            type="button"
            aria-expanded={smallProjectsExpanded}
            aria-controls="small-projects-content"
            onClick={() => setSmallProjectsExpanded((expanded) => !expanded)}
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              p: { xs: 2, md: 3 },
              border: `1px solid ${borderColor}`,
              borderRadius: smallProjectsExpanded ? '20px 20px 0 0' : '20px',
              bgcolor: alpha(cardSurface, isDark ? 0.55 : 0.7),
              color: headingColor,
              font: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
              transition:
                'background-color 200ms ease, border-color 200ms ease',
              '&:hover': {
                bgcolor: alpha(secondary, isDark ? 0.08 : 0.035),
                borderColor: alpha(secondary, 0.35)
              },
              '&:focus-visible': {
                outline: `2px solid ${primary}`,
                outlineOffset: 3
              }
            }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 1.5, md: 2 }}
              sx={{
                alignItems: 'center',
                minWidth: 0
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  width: { xs: 44, md: 52 },
                  height: { xs: 44, md: 52 },
                  borderRadius: '15px',
                  color: secondary,
                  bgcolor: alpha(secondary, isDark ? 0.15 : 0.08),
                  border: `1px solid ${alpha(secondary, 0.2)}`
                }}
              >
                <CodeRoundedIcon sx={{ fontSize: { xs: 23, md: 27 } }} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: secondary,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase'
                  }}
                >
                  MORE FROM OUR WORKSHOP
                </Typography>

                <Typography
                  id="small-projects-heading"
                  component="span"
                  sx={{
                    display: 'block',
                    fontSize: {
                      xs: '1.15rem',
                      sm: '1.4rem',
                      md: '1.75rem'
                    },
                    fontWeight: 850,
                    letterSpacing: '-0.045em',
                    lineHeight: 1.3,
                    textWrap: 'balance'
                  }}
                >
                  Small projects.{' '}
                  <Box component="span" sx={{ color: primary }}>
                    Big ideas.
                  </Box>
                </Typography>

                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    mt: 0.6,
                    color: mutedColor,
                    fontSize: { xs: '0.78rem', md: '0.85rem' },
                    lineHeight: 1.7
                  }}
                >
                  {smallProjectsLoading
                    ? 'Loading projects...'
                    : smallProjectsError
                      ? 'Projects are temporarily unavailable'
                      : `${smallProjects.length} projects in the collection`}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              component="span"
              tabIndex={-1}
              aria-hidden="true"
              disableRipple
              sx={{
                flexShrink: 0,
                width: { xs: 38, md: 44 },
                height: { xs: 38, md: 44 },
                color: secondary,
                bgcolor: alpha(secondary, isDark ? 0.12 : 0.055),
                border: `1px solid ${alpha(secondary, 0.2)}`,
                pointerEvents: 'none'
              }}
            >
              <ExpandMoreRoundedIcon
                sx={{
                  fontSize: 27,
                  transform: smallProjectsExpanded
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                  transition: 'transform 250ms ease'
                }}
              />
            </IconButton>
          </Box>

          {/* Collapsible content */}
          <Collapse in={smallProjectsExpanded} timeout={280} unmountOnExit>
            <Box
              id="small-projects-content"
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                border: `1px solid ${borderColor}`,
                borderTop: 0,
                borderRadius: '0 0 20px 20px',
                bgcolor: alpha(cardSurface, isDark ? 0.25 : 0.35)
              }}
            >
              <Typography
                sx={{
                  maxWidth: 620,
                  mx: 'auto',
                  mb: { xs: 3, md: 4 },
                  color: mutedColor,
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                  lineHeight: 1.9,
                  textAlign: 'center'
                }}
              >
                A collection of tools, bots, extensions, libraries, and
                experiments built to solve specific problems across different
                ecosystems.
              </Typography>

              {smallProjectsLoading && (
                <Box
                  role="status"
                  sx={{
                    py: 5,
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      color: mutedColor,
                      fontSize: '0.9rem'
                    }}
                  >
                    Loading small projects...
                  </Typography>
                </Box>
              )}

              {!smallProjectsLoading && smallProjectsError && (
                <Stack
                  role="alert"
                  spacing={2}
                  sx={{
                    alignItems: 'center',
                    py: 5,
                    px: 3,
                    border: `1px dashed ${borderColor}`,
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      color: mutedColor,
                      fontSize: '0.9rem',
                      lineHeight: 1.8
                    }}
                  >
                    Unable to load small projects. Please try again.
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={handleSmallProjectsRetry}
                    sx={{
                      borderRadius: '10px',
                      borderColor: alpha(secondary, 0.3),
                      color: headingColor,
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': {
                        borderColor: alpha(primary, 0.65),
                        bgcolor: alpha(primary, 0.07)
                      }
                    }}
                  >
                    Retry
                  </Button>
                </Stack>
              )}

              {!smallProjectsLoading &&
                !smallProjectsError &&
                smallProjects.length === 0 && (
                  <Box
                    sx={{
                      py: 5,
                      px: 3,
                      border: `1px dashed ${borderColor}`,
                      borderRadius: 3,
                      textAlign: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        color: mutedColor,
                        fontSize: '0.9rem'
                      }}
                    >
                      No small projects are available yet.
                    </Typography>
                  </Box>
                )}

              {!smallProjectsLoading &&
                !smallProjectsError &&
                smallProjects.length > 0 && (
                  <>
                    <Grid container spacing={{ xs: 1.5, md: 2 }}>
                      {visibleSmallProjects.map((project) => (
                        <Grid
                          key={project.id}
                          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                        >
                          <SmallProjectCard
                            project={project}
                            primary={primary}
                            secondary={secondary}
                            isDark={isDark}
                            headingColor={headingColor}
                            mutedColor={mutedColor}
                            cardSurface={cardSurface}
                            borderColor={borderColor}
                            onOpenDetails={() =>
                              handleOpenSmallDetails(project)
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {smallProjectsPageCount > 1 && (
                      <Stack
                        spacing={1.5}
                        sx={{
                          alignItems: 'center',
                          mt: { xs: 4, md: 5 }
                        }}
                      >
                        <Pagination
                          count={smallProjectsPageCount}
                          page={smallProjectsPage}
                          onChange={handleSmallProjectsPageChange}
                          color="primary"
                          shape="rounded"
                          size="large"
                          siblingCount={1}
                          boundaryCount={1}
                          aria-label="Small project pages"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              fontWeight: 700,
                              borderRadius: 2
                            },
                            '& .MuiPaginationItem-root.Mui-selected': {
                              boxShadow: `0 0 18px ${alpha(
                                theme.palette.primary.main,
                                0.18
                              )}`
                            }
                          }}
                        />

                        <Typography
                          aria-live="polite"
                          sx={{
                            color: mutedColor,
                            fontSize: '0.75rem',
                            textAlign: 'center'
                          }}
                        >
                          Showing{' '}
                          {(smallProjectsPage - 1) * SMALL_PROJECTS_PER_PAGE +
                            1}
                          –
                          {Math.min(
                            smallProjectsPage * SMALL_PROJECTS_PER_PAGE,
                            smallProjects.length
                          )}{' '}
                          of {smallProjects.length} small projects
                        </Typography>
                      </Stack>
                    )}
                  </>
                )}
            </Box>
          </Collapse>
        </Box>
      </Container>

      {/* ===================================================== */}
      {/* PROJECT DETAILS MODAL */}
      {/* ===================================================== */}

      <Dialog
        open={selectedProject !== null}
        onClose={handleCloseDetails}
        fullWidth
        fullScreen={isMobile}
        maxWidth="md"
        scroll="paper"
        aria-labelledby="project-details-title"
        slotProps={{
          paper: {
            sx: {
              overflow: 'hidden',
              border: isMobile ? 'none' : `1px solid ${borderColor}`,
              borderRadius: { xs: 0, sm: 4 },
              bgcolor: theme.secondaryScale?.[4],
              backgroundImage: 'none',
              boxShadow: isMobile
                ? 'none'
                : `0 32px 100px ${alpha('#000000', 0.4)}`,
              height: isMobile ? '100%' : 'auto',
              maxHeight: isMobile ? '100%' : 'calc(100% - 64px)'
            }
          }
        }}
      >
        {selectedProject && (
          <>
            {/* Gradient cover */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                position: 'relative',
                minHeight: { xs: 190, sm: 270 },
                overflow: 'hidden',
                isolation: 'isolate',
                background: `
            radial-gradient(
              ellipse at 12% 15%,
              ${alpha(primary, 0.8)} 0%,
              transparent 48%
            ),
            radial-gradient(
              ellipse at 90% 90%,
              ${alpha(secondary, 0.7)} 0%,
              transparent 45%
            ),
            linear-gradient(
              130deg,
              ${alpha(primary, 0.24)} 0%,
              ${cardSurface} 52%,
              ${alpha(secondary, 0.2)} 100%
            )
          `,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  zIndex: -1,
                  opacity: isDark ? 0.22 : 0.12,
                  backgroundImage: `
              linear-gradient(${alpha(headingColor, 0.22)} 1px, transparent 1px),
              linear-gradient(90deg, ${alpha(headingColor, 0.22)} 1px, transparent 1px)
            `,
                  backgroundSize: '30px 30px',
                  maskImage: 'linear-gradient(to bottom, black, transparent)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  zIndex: -1,
                  width: { xs: 210, sm: 320 },
                  height: { xs: 210, sm: 320 },
                  right: { xs: -75, sm: 20 },
                  top: { xs: -105, sm: -165 },
                  borderRadius: '50%',
                  border: `1px solid ${alpha(headingColor, 0.22)}`,
                  boxShadow: `
              0 0 0 28px ${alpha(headingColor, 0.035)},
              0 0 0 58px ${alpha(headingColor, 0.025)},
              0 0 0 90px ${alpha(headingColor, 0.018)}
            `
                }
              }}
            >
              {/* Top controls */}
              {/* Top controls */}
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 10,
                  top: { xs: 16, sm: 22 },
                  left: { xs: 16, sm: 26 },
                  right: { xs: 16, sm: 26 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  pointerEvents: 'none'
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: '999px',
                    border: `1px solid ${alpha(headingColor, 0.18)}`,
                    bgcolor: alpha(cardSurface, 0.35),
                    backdropFilter: 'blur(14px)'
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: primary,
                      boxShadow: `0 0 12px ${alpha(primary, 0.8)}`
                    }}
                  />

                  <Typography
                    sx={{
                      color: headingColor,
                      fontSize: '0.65rem',
                      fontWeight: 850,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase'
                    }}
                  >
                    CRYPTECH / PROJECTS
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleCloseDetails}
                  aria-label="Close project details"
                  sx={{
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 11,
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    color: headingColor,
                    border: `1px solid ${alpha(headingColor, 0.25)}`,
                    bgcolor: alpha(cardSurface, 0.8),
                    backdropFilter: 'blur(14px)',
                    '&:hover': {
                      bgcolor: alpha(headingColor, 0.15),
                      transform: 'rotate(90deg)'
                    },
                    transition:
                      'transform 220ms ease, background-color 220ms ease'
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              {/* Decorative visual */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: { xs: 18, sm: 65 },
                  transform: 'translateY(-35%)',
                  width: { xs: 105, sm: 155 },
                  height: { xs: 105, sm: 155 },
                  borderRadius: { xs: '28px', sm: '38px' },
                  border: `1px solid ${alpha(headingColor, 0.2)}`,
                  bgcolor: alpha(cardSurface, 0.16),
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 20px 60px ${alpha('#000000', 0.12)}`,
                  rotate: '-12deg',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 10,
                    borderRadius: { xs: '20px', sm: '28px' },
                    border: `1px solid ${alpha(headingColor, 0.14)}`
                  }
                }}
              >
                <AutoAwesomeRoundedIcon
                  sx={{
                    fontSize: { xs: 43, sm: 65 },
                    color: headingColor,
                    filter: `drop-shadow(0 0 20px ${alpha(primary, 0.55)})`
                  }}
                />
              </Box>

              {/* Cover title */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  minHeight: { xs: 190, sm: 270 },
                  p: { xs: 2.5, sm: 4 },
                  pr: { xs: 15, sm: 30 },
                  background: `linear-gradient(
              0deg,
              ${alpha(cardSurface, isDark ? 0.82 : 0.68)} 0%,
              transparent 78%
            )`
                }}
              >
                <Typography
                  sx={{
                    mb: 1,
                    color: primary,
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedProject.kind === 'flagship'
                    ? `FEATURED PROJECT / ${String(
                        selectedProject.project.number
                      ).padStart(2, '0')}`
                    : `SIDE PROJECT / ${String(
                        selectedProject.project.id
                      ).padStart(2, '0')}`}
                </Typography>

                <Typography
                  sx={{
                    color: headingColor,
                    fontSize: { xs: '1.65rem', sm: '2.5rem' },
                    fontWeight: 950,
                    letterSpacing: '-0.06em',
                    lineHeight: 1.08,
                    overflowWrap: 'anywhere',
                    textShadow: `0 2px 24px ${alpha('#000000', 0.16)}`
                  }}
                >
                  {selectedProject.kind === 'flagship'
                    ? selectedProject.project.title
                    : selectedProject.project.project_name}
                </Typography>
              </Box>
            </Box>

            {/* Project identity */}
            <Box
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: 2.5,
                display: { xs: 'none', lg: 'flex' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                borderBottom: `1px solid ${borderColor}`
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  id="project-details-title"
                  sx={{
                    color: headingColor,
                    fontSize: { xs: '1.05rem', sm: '1.2rem' },
                    fontWeight: 850,
                    letterSpacing: '-0.035em'
                  }}
                >
                  Project overview
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: mutedColor,
                    fontSize: '0.85rem',
                    lineHeight: 1.7
                  }}
                >
                  A closer look at the work, technologies, and implementation.
                </Typography>
              </Box>

              <Box
                sx={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.5,
                  py: 0.8,
                  borderRadius: '10px',
                  border: `1px solid ${alpha(primary, 0.25)}`,
                  bgcolor: alpha(primary, isDark ? 0.12 : 0.07)
                }}
              >
                <Typography
                  sx={{
                    color: primary,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}
                >
                  {selectedProject.kind === 'flagship'
                    ? 'FLAGSHIP'
                    : 'SMALL PROJECT'}
                </Typography>
              </Box>
            </Box>

            {/* Project content */}
            <DialogContent
              sx={{
                p: { xs: 2.5, sm: 4 },
                '&:first-of-type': {
                  pt: { xs: 2.5, sm: 4 }
                }
              }}
            >
              {selectedProject.kind === 'flagship' ? (
                <FlagshipProjectDetails
                  project={selectedProject.project}
                  primary={primary}
                  secondary={secondary}
                  headingColor={headingColor}
                  mutedColor={mutedColor}
                  cardSurface={cardSurface}
                  borderColor={borderColor}
                  isDark={isDark}
                />
              ) : (
                <SmallProjectDetails
                  project={selectedProject.project}
                  primary={primary}
                  headingColor={headingColor}
                  mutedColor={mutedColor}
                  borderColor={borderColor}
                />
              )}
            </DialogContent>

            {/* Footer */}
            <DialogActions
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                justifyContent: 'space-between',
                bgcolor: alpha(theme.palette.text.primary, 0.015)
              }}
            >
              <Typography
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.secondary',
                  fontFamily: 'monospace',
                  fontSize: '0.64rem',
                  letterSpacing: '0.08em'
                }}
              >
                CRYPTECH / DIGITAL SOLUTIONS
              </Typography>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

/* ============================================================= */
/* FLAGSHIP PROJECT CARD */
/* ============================================================= */

type ProjectCardProps = {
  project: Project;
  primary: string;
  secondary: string;
  isDark: boolean;
  headingColor: string;
  mutedColor: string;
  cardSurface: string;
  borderColor: string;
  onOpenDetails: () => void;
};

function ProjectCard({
  project,
  primary,
  secondary,
  isDark,
  headingColor,
  mutedColor,
  cardSurface,
  borderColor,
  onOpenDetails
}: ProjectCardProps) {
  const {
    number,
    title,
    category,
    description,
    technologies,
    type,
    liveUrl,
    sourceUrl,
    featured,
    banner
  } = project;

  const projectAccent = type === 'web3' ? secondary : primary;

  const projectTypeLabel =
    type === 'web3'
      ? 'Blockchain'
      : type === 'design'
        ? 'UI / UX Design'
        : type === 'game'
          ? 'Game Servers'
          : 'Web Development';

  return (
    <Box
      component="article"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: featured ? { xs: 'column', md: 'row' } : 'column',
        height: '100%',
        minWidth: 0,
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        borderRadius: { xs: 3, md: 4 },
        bgcolor: cardSurface,
        transition:
          'transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: alpha(projectAccent, 0.48),
          boxShadow: `0 20px 48px ${alpha('#000000', isDark ? 0.22 : 0.075)}`
        },
        '&:hover .project-card-image': {
          transform: 'scale(1.045)'
        },
        '&:hover .project-card-action': {
          backgroundColor: alpha(projectAccent, isDark ? 0.16 : 0.09),
          borderColor: alpha(projectAccent, 0.4)
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
          '&:hover .project-card-image': { transform: 'none' }
        }
      }}
    >
      {/* Preview artwork */}
      <Box
        sx={{
          position: 'relative',
          flex: featured ? '1.1 1 0' : 'none',
          minWidth: 0,
          minHeight: featured
            ? { xs: 230, sm: 300, md: 0 }
            : { xs: 210, sm: 235 },
          aspectRatio: featured ? { xs: '16 / 9', md: 'auto' } : '16 / 10',
          overflow: 'hidden',
          bgcolor: alpha(projectAccent, isDark ? 0.1 : 0.055),
          background: `linear-gradient(
            135deg,
            ${alpha(projectAccent, isDark ? 0.19 : 0.12)},
            ${alpha(secondary, isDark ? 0.1 : 0.055)}
          )`
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(
              ${alpha(projectAccent, 0.45)} 0.7px,
              transparent 0.7px
            )`,
            backgroundSize: '20px 20px',
            opacity: isDark ? 0.3 : 0.18,
            maskImage: 'linear-gradient(135deg, black, transparent 85%)'
          }}
        />

        {banner ? (
          <Box
            component="img"
            className="project-card-image"
            src={banner}
            alt={`${title} project preview`}
            loading="lazy"
            decoding="async"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              p: { xs: 2, sm: 2.5 },
              objectFit: 'contain',
              transition: 'transform 400ms ease'
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <CodeRoundedIcon
              sx={{
                fontSize: { xs: 64, md: 84 },
                color: projectAccent,
                opacity: 0.75
              }}
            />
          </Box>
        )}

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(
              to top,
              ${alpha('#000000', isDark ? 0.35 : 0.12)},
              transparent 45%
            )`
          }}
        />

        <Chip
          label={category}
          size="small"
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            maxWidth: 'calc(100% - 100px)',
            height: 29,
            borderRadius: '8px',
            bgcolor: alpha(cardSurface, isDark ? 0.92 : 0.96),
            border: `1px solid ${alpha(headingColor, 0.1)}`,
            color: headingColor,
            fontSize: '0.63rem',
            fontWeight: 800,
            letterSpacing: '0.045em',
            '& .MuiChip-label': {
              px: 1.1,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }}
        />

        {featured && (
          <Chip
            icon={
              <AutoAwesomeRoundedIcon
                sx={{ color: `${projectAccent} !important` }}
              />
            }
            label="FEATURED"
            size="small"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              height: 29,
              borderRadius: '8px',
              bgcolor: alpha(cardSurface, isDark ? 0.92 : 0.96),
              border: `1px solid ${alpha(projectAccent, 0.28)}`,
              color: projectAccent,
              fontSize: '0.65rem',
              fontWeight: 800,
              '& .MuiChip-icon': {
                ml: 0.8,
                fontSize: 15
              }
            }}
          />
        )}

        <Typography
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 14,
            color: alpha('#FFFFFF', 0.9),
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textShadow: '0 1px 8px rgba(0,0,0,0.45)'
          }}
        >
          PROJECT / {String(number).padStart(2, '0')}
        </Typography>
      </Box>

      {/* Card details */}
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2.5, md: featured ? 3.5 : 3 }
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
            <Box
              sx={{
                width: 7,
                height: 7,
                flexShrink: 0,
                borderRadius: '50%',
                bgcolor: projectAccent,
                boxShadow: `0 0 10px ${alpha(projectAccent, 0.5)}`
              }}
            />

            <Typography
              sx={{
                color: mutedColor,
                fontSize: '0.7rem',
                fontWeight: 750,
                letterSpacing: '0.09em',
                textTransform: 'uppercase'
              }}
            >
              {projectTypeLabel}
            </Typography>
          </Stack>

          <ArrowOutwardRoundedIcon
            sx={{
              flexShrink: 0,
              fontSize: 19,
              color: projectAccent
            }}
          />
        </Stack>

        <Typography
          component="h3"
          sx={{
            color: headingColor,
            fontSize: featured
              ? { xs: '1.55rem', md: '1.9rem' }
              : { xs: '1.3rem', md: '1.4rem' },
            fontWeight: 850,
            lineHeight: 1.25,
            letterSpacing: '-0.045em',
            overflowWrap: 'anywhere'
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: mutedColor,
            fontSize: '0.875rem',
            lineHeight: 1.85,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: featured ? 5 : 4,
            overflow: 'hidden'
          }}
        >
          {description}
        </Typography>

        <Box sx={{ mt: 'auto !important', pt: 0.5 }}>
          <Typography
            sx={{
              mb: 1.1,
              color: mutedColor,
              fontSize: '0.66rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            Technologies
          </Typography>

          <Stack
            direction="row"
            useFlexGap
            sx={{
              flexWrap: 'wrap',
              gap: 0.8
            }}
          >
            {technologies.map((technology) => (
              <Chip
                key={technology}
                label={technology}
                size="small"
                variant="outlined"
                sx={{
                  height: 27,
                  borderRadius: '7px',
                  borderColor: alpha(headingColor, 0.12),
                  bgcolor: alpha(headingColor, isDark ? 0.035 : 0.02),
                  color: mutedColor,
                  fontSize: '0.69rem',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Project actions */}
        <Stack
          direction="row"
          useFlexGap
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            pt: 2,
            mt: 0.5,
            borderTop: `1px solid ${borderColor}`
          }}
        >
          <Button
            onClick={onOpenDetails}
            variant="contained"
            startIcon={<InfoOutlinedIcon />}
            sx={{
              flex: '1 1 auto',
              minWidth: 0,
              minHeight: 40,
              px: 1.5,
              borderRadius: '10px',
              background: `linear-gradient(110deg, ${primary}, ${secondary})`,
              color: '#FFFFFF',
              fontSize: '0.77rem',
              fontWeight: 750,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                background: `linear-gradient(110deg, ${primary}, ${secondary})`,
                filter: 'brightness(1.08)',
                boxShadow: 'none'
              }
            }}
          >
            View Details
          </Button>

          {liveUrl && (
            <Button
              className="project-card-action"
              component="a"
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<LanguageRoundedIcon />}
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={{
                flex: '1 1 auto',
                minWidth: 0,
                minHeight: 40,
                px: 1.5,
                borderRadius: '10px',
                borderColor: alpha(projectAccent, 0.3),
                color: projectAccent,
                fontSize: '0.77rem',
                fontWeight: 750,
                textTransform: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Live Preview
            </Button>
          )}

          {sourceUrl && (
            <Button
              className="project-card-action"
              component="a"
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<GitHubIcon />}
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={{
                flex: '1 1 auto',
                minWidth: 0,
                minHeight: 40,
                px: 1.5,
                borderRadius: '10px',
                borderColor,
                color: mutedColor,
                fontSize: '0.77rem',
                fontWeight: 750,
                textTransform: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Source Code
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

/* ============================================================= */
/* SMALL PROJECT CARD */
/* ============================================================= */

type SmallProjectCardProps = {
  project: SmallProject;
  primary: string;
  secondary: string;
  isDark: boolean;
  headingColor: string;
  mutedColor: string;
  cardSurface: string;
  borderColor: string;
  onOpenDetails: () => void;
};

function SmallProjectCard({
  project,
  primary,
  secondary,
  isDark,
  headingColor,
  mutedColor,
  cardSurface,
  borderColor,
  onOpenDetails
}: SmallProjectCardProps) {
  const accent = secondary;

  const cardSx = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    minHeight: 188,
    minWidth: 0,
    p: { xs: 2.25, md: 2.5 },
    gap: 2,
    overflow: 'hidden',
    border: `1px solid ${borderColor}`,
    borderRadius: 3,
    bgcolor: cardSurface,
    color: 'inherit',
    textDecoration: 'none',
    transition:
      'transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: alpha(accent, 0.48),
      boxShadow: `0 14px 35px ${alpha('#000000', isDark ? 0.2 : 0.055)}`
    },
    '&:hover .small-project-icon': {
      bgcolor: alpha(accent, isDark ? 0.2 : 0.12),
      borderColor: alpha(accent, 0.35)
    },
    '&:focus-visible': {
      outline: `2px solid ${primary}`,
      outlineOffset: 3
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': {
        transform: 'none'
      }
    }
  };

  return (
    <Box component="article" sx={cardSx}>
      {/* Icon and project number */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          className="small-project-icon"
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: '13px',
            color: accent,
            bgcolor: alpha(accent, isDark ? 0.13 : 0.07),
            border: `1px solid ${alpha(accent, 0.17)}`,
            transition: 'background-color 220ms ease, border-color 220ms ease'
          }}
        >
          <CodeRoundedIcon sx={{ fontSize: 22 }} />
        </Box>

        <Typography
          sx={{
            color: alpha(headingColor, 0.42),
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.08em'
          }}
        >
          {String(project.id).padStart(2, '0')}
        </Typography>
      </Stack>

      {/* Name and description */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component="h4"
          sx={{
            mb: 0.8,
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            overflowWrap: 'anywhere'
          }}
        >
          {project.project_name}
        </Typography>

        <Typography
          sx={{
            color: mutedColor,
            fontSize: '0.8rem',
            lineHeight: 1.8,
            overflowWrap: 'anywhere'
          }}
        >
          {project.project_desc || 'An experimental project.'}
        </Typography>
      </Box>

      {/* Card footer */}
      <Stack
        direction="row"
        sx={{
          pt: 1.5,
          gap: 1,
          borderTop: `1px solid ${alpha(headingColor, 0.08)}`,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <Button
          onClick={onOpenDetails}
          size="small"
          startIcon={<InfoOutlinedIcon />}
          sx={{
            p: 0,
            minWidth: 0,
            color: accent,
            fontSize: '0.75rem',
            fontWeight: 750,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': {
              bgcolor: 'transparent',
              color: primary
            }
          }}
        >
          View Details
        </Button>

        {project.project_link && (
          <Button
            component="a"
            href={project.project_link}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            aria-label={`Open ${project.project_name}`}
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{
              p: 0,
              minWidth: 0,
              color: mutedColor,
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                color: accent
              }
            }}
          >
            Explore
          </Button>
        )}
      </Stack>
    </Box>
  );
}

/* ============================================================= */
/* FLAGSHIP PROJECT MODAL DETAILS */
/* ============================================================= */

type FlagshipProjectDetailsProps = {
  project: Project;
  primary: string;
  secondary: string;
  headingColor: string;
  mutedColor: string;
  cardSurface: string;
  borderColor: string;
  isDark: boolean;
};

function FlagshipProjectDetails({
  project,
  primary,
  secondary,
  headingColor,
  mutedColor,
  cardSurface,
  borderColor,
  isDark
}: FlagshipProjectDetailsProps) {
  const projectAccent = project.type === 'web3' ? secondary : primary;

  const projectTypeLabel =
    project.type === 'web3'
      ? 'Blockchain'
      : project.type === 'design'
        ? 'UI / UX Design'
        : project.type === 'game'
          ? 'Game Servers'
          : 'Web Development';

  return (
    <Stack spacing={3}>
      {/* Project artwork */}
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          minHeight: { xs: 180, sm: 260 },
          overflow: 'hidden',
          border: `1px solid ${borderColor}`,
          borderRadius: 3,
          bgcolor: alpha(projectAccent, isDark ? 0.1 : 0.055),
          background: `linear-gradient(
            135deg,
            ${alpha(projectAccent, isDark ? 0.18 : 0.1)},
            ${alpha(secondary, isDark ? 0.1 : 0.04)}
          )`
        }}
      >
        {project.banner ? (
          <Box
            component="img"
            src={project.banner}
            alt={`${project.title} preview`}
            sx={{
              display: 'block',
              width: '100%',
              maxHeight: { xs: 240, sm: 340 },
              objectFit: 'contain',
              p: { xs: 2, sm: 3 }
            }}
          />
        ) : (
          <CodeRoundedIcon
            sx={{
              fontSize: { xs: 65, sm: 90 },
              color: projectAccent,
              opacity: 0.75
            }}
          />
        )}
      </Box>

      {/* Category and featured status */}
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label={project.category}
          sx={{
            borderRadius: '8px',
            bgcolor: alpha(projectAccent, 0.1),
            color: projectAccent,
            fontWeight: 750
          }}
        />

        <Chip
          label={projectTypeLabel}
          variant="outlined"
          sx={{
            borderColor,
            color: mutedColor,
            borderRadius: '8px'
          }}
        />

        {project.featured && (
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="Featured"
            sx={{
              borderRadius: '8px',
              bgcolor: alpha(projectAccent, 0.08),
              color: projectAccent,
              '& .MuiChip-icon': {
                color: projectAccent
              }
            }}
          />
        )}
      </Stack>

      {/* Full description */}
      <Box>
        <Typography
          sx={{
            mb: 1,
            color: headingColor,
            fontSize: '0.72rem',
            fontWeight: 850,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          About this project
        </Typography>

        <Typography
          sx={{
            color: mutedColor,
            fontSize: '0.93rem',
            lineHeight: 2,
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere'
          }}
        >
          {project.description || 'No additional description is available.'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor }} />

      {/* Technologies */}
      <Box>
        <Typography
          sx={{
            mb: 1.5,
            color: headingColor,
            fontSize: '0.72rem',
            fontWeight: 850,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          Technologies and tools
        </Typography>

        {project.technologies?.length ? (
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
            {project.technologies.map((technology) => (
              <Chip
                key={technology}
                label={technology}
                variant="outlined"
                sx={{
                  borderRadius: '8px',
                  borderColor: alpha(projectAccent, 0.25),
                  bgcolor: alpha(projectAccent, isDark ? 0.06 : 0.035),
                  color: mutedColor,
                  fontWeight: 650
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography sx={{ color: mutedColor, fontSize: '0.875rem' }}>
            No technologies have been listed.
          </Typography>
        )}
      </Box>

      {/* Project links */}
      {(project.liveUrl || project.sourceUrl) && (
        <>
          <Divider sx={{ borderColor }} />

          <Box>
            <Typography
              sx={{
                mb: 1.5,
                color: headingColor,
                fontSize: '0.72rem',
                fontWeight: 850,
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              Explore the project
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              useFlexGap
              sx={{ flexWrap: 'wrap', gap: 1.25 }}
            >
              {project.liveUrl && (
                <Button
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<LanguageRoundedIcon />}
                  endIcon={<ArrowOutwardRoundedIcon />}
                  sx={{
                    flex: '1 1 180px',
                    py: 1.2,
                    borderRadius: '11px',
                    background: `linear-gradient(110deg, ${primary}, ${secondary})`,
                    color: '#FFFFFF',
                    fontWeight: 750,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      filter: 'brightness(1.08)',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Live Preview
                </Button>
              )}

              {project.sourceUrl && (
                <Button
                  component="a"
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  endIcon={<ArrowOutwardRoundedIcon />}
                  sx={{
                    flex: '1 1 180px',
                    py: 1.2,
                    borderRadius: '11px',
                    borderColor: alpha(projectAccent, 0.3),
                    color: projectAccent,
                    fontWeight: 750,
                    textTransform: 'none'
                  }}
                >
                  Source Code
                </Button>
              )}
            </Stack>
          </Box>
        </>
      )}

      <Box
        sx={{
          p: 2,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          bgcolor: alpha(cardSurface, isDark ? 0.7 : 0.5)
        }}
      >
        <Stack direction="row" spacing={1.2} sx={{ alignItems: 'flex-start' }}>
          <InfoOutlinedIcon
            sx={{
              mt: 0.15,
              fontSize: 20,
              color: projectAccent
            }}
          />

          <Box>
            <Typography
              sx={{
                mb: 0.4,
                color: headingColor,
                fontSize: '0.82rem',
                fontWeight: 750
              }}
            >
              Project overview
            </Typography>

            <Typography
              sx={{
                color: mutedColor,
                fontSize: '0.8rem',
                lineHeight: 1.8
              }}
            >
              This project is part of the Cryptech Services portfolio. Contact
              us if you would like to discuss a similar solution or a custom
              implementation.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

/* ============================================================= */
/* SMALL PROJECT MODAL DETAILS */
/* ============================================================= */

type SmallProjectDetailsProps = {
  project: SmallProject;
  primary: string;
  headingColor: string;
  mutedColor: string;
  borderColor: string;
};

function SmallProjectDetails({
  project,
  primary,
  headingColor,
  mutedColor,
  borderColor
}: SmallProjectDetailsProps) {
  return (
    <Stack spacing={3}>
      {/* Project icon */}
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          minHeight: 170,
          border: `1px solid ${borderColor}`,
          borderRadius: 3,
          background: `linear-gradient(
            135deg,
            ${alpha(primary, 0.12)},
            ${alpha(primary, 0.025)}
          )`
        }}
      >
        <CodeRoundedIcon
          sx={{
            fontSize: 76,
            color: primary,
            opacity: 0.8
          }}
        />
      </Box>

      <Box>
        <Typography
          sx={{
            mb: 1,
            color: headingColor,
            fontSize: '0.72rem',
            fontWeight: 850,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          About this project
        </Typography>

        <Typography
          sx={{
            color: mutedColor,
            fontSize: '0.93rem',
            lineHeight: 2,
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere'
          }}
        >
          {project.project_desc || 'An experimental project from our workshop.'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor }} />

      <Box>
        <Typography
          sx={{
            mb: 1,
            color: headingColor,
            fontSize: '0.72rem',
            fontWeight: 850,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          Project information
        </Typography>

        <Stack spacing={1.5}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Typography sx={{ color: mutedColor, fontSize: '0.85rem' }}>
              Project ID
            </Typography>

            <Typography
              sx={{
                color: headingColor,
                fontSize: '0.85rem',
                fontWeight: 750
              }}
            >
              {String(project.id).padStart(2, '0')}
            </Typography>
          </Box>

          <Divider sx={{ borderColor }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Typography sx={{ color: mutedColor, fontSize: '0.85rem' }}>
              Availability
            </Typography>

            <Typography
              sx={{
                color: project.project_link ? primary : mutedColor,
                fontSize: '0.85rem',
                fontWeight: 750,
                textAlign: 'right'
              }}
            >
              {project.project_link ? 'Available online' : 'Project archive'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {project.project_link && (
        <>
          <Divider sx={{ borderColor }} />

          <Button
            component="a"
            href={project.project_link}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            fullWidth
            startIcon={<LanguageRoundedIcon />}
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{
              py: 1.3,
              borderRadius: '11px',
              background: `linear-gradient(110deg, ${primary}, ${alpha(primary, 0.75)})`,
              color: '#FFFFFF',
              fontWeight: 750,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                filter: 'brightness(1.08)',
                boxShadow: 'none'
              }
            }}
          >
            Explore Project
          </Button>
        </>
      )}
    </Stack>
  );
}
