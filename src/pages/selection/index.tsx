'use client';

import * as React from 'react';

import Head from 'next/head';
import Image from 'next/image';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';

import CheckIcon from '@mui/icons-material/Check';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import Navbar from '@/theme/layout/Navbar';
import { useThemeContext } from '@/contexts/themeContext';
import { THEME_ICONS, THEME_SETS } from '@/theme/theme';
import router from 'next/router';

type ThemeKey = keyof typeof THEME_SETS;

type ThemeItem = {
  label: string;
  category: string;
  color: string;
  secondary: string;
  gray: string;
  background: string;
  icon?: string;
};

type ThemeEntry = [Exclude<ThemeKey, 'custom'>, ThemeItem];

const CATEGORY_LABELS: Record<string, string> = {
  classic: 'Classic',
  mythology: 'Mythology',
  minecraft: 'Minecraft',
  cosmic: 'Cosmic',
  premium: 'Premium',
  hogwarts: 'Hogwarts',
  elements: 'Elements'
};

export default function ThemeSetsPage() {
  const theme = useTheme();
  const [isProceeding, setIsProceeding] = React.useState(false);
  const [isLoaderExiting, setIsLoaderExiting] = React.useState(false);
  const { themeSet, setThemeSet } = useThemeContext();

  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const items = React.useMemo(
    () =>
      Object.entries(THEME_SETS).filter(
        ([key]) => key !== 'custom'
      ) as ThemeEntry[],
    []
  );

  const categories = React.useMemo(
    () => Array.from(new Set(items.map(([, item]) => item.category))),
    [items]
  );

  const filteredThemes = React.useMemo(
    () =>
      activeCategory === 'all'
        ? items
        : items.filter(([, item]) => item.category === activeCategory),
    [activeCategory, items]
  );

  const activeTheme = THEME_SETS[themeSet] as ThemeItem | undefined;

  const primary = theme.colorScale[9];
  const secondary = theme.secondaryScale[9];

  const background = theme.backgroundScale[1];
  const surface = theme.secondaryScale[2];

  const textPrimary = theme.grayScale[12];
  const textSecondary = theme.grayScale[10];

  const isDark = theme.palette.mode === 'dark';

  const selectTheme = (key: ThemeKey) => {
    setThemeSet(key);
  };

  return (
    <>
      <Head>
        <title>Theme Selection | {activeTheme?.label ?? 'Theme System'}</title>

        <meta
          name="description"
          content="Explore and select a theme for the Cryptech Services design system."
        />

        <meta name="theme-color" content={background} />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',

          background: `
            radial-gradient(
              circle at 50% 0%,
              ${alpha(primary, 0.1)},
              transparent 42%
            ),
            radial-gradient(
              circle at 100% 45%,
              ${alpha(secondary, 0.08)},
              transparent 35%
            ),
            ${surface}
          `,

          color: textPrimary
        }}
      >
        {isProceeding && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              overflow: 'hidden',

              background: `
        radial-gradient(
          circle at 50% 50%,
          ${alpha(primary, 0.18)},
          transparent 35%
        )
        ${surface}
      `,

              backdropFilter: 'blur(18px)',

              animation: 'themeLoaderFadeIn 350ms ease-out forwards',

              '@keyframes themeLoaderFadeIn': {
                from: {
                  opacity: 0
                },
                to: {
                  opacity: 1
                }
              },

              '@keyframes themeLoaderPulse': {
                '0%, 100%': {
                  transform: 'scale(0.92)',
                  opacity: 0.45
                },
                '50%': {
                  transform: 'scale(1.08)',
                  opacity: 0.8
                }
              },

              '@keyframes themeLoaderSpin': {
                from: {
                  transform: 'rotate(0deg)'
                },
                to: {
                  transform: 'rotate(360deg)'
                }
              },

              '@keyframes themeLoaderScale': {
                '0%': {
                  transform: 'scale(0.65)',
                  opacity: 0
                },
                '35%': {
                  transform: 'scale(1)',
                  opacity: 1
                },
                '70%': {
                  transform: 'scale(1.08)',
                  opacity: 1
                },
                '100%': {
                  transform: 'scale(1.35)',
                  opacity: 0
                }
              },

              '@keyframes themeLoaderBar': {
                from: {
                  transform: 'scaleX(0)'
                },
                to: {
                  transform: 'scaleX(1)'
                }
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,

                backgroundImage: `
              linear-gradient(
                ${alpha(primary, 0.1)} 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                ${alpha(primary, 0.1)} 1px,
                transparent 1px
              )
            `,

                backgroundSize: '48px 48px',

                maskImage: 'linear-gradient(to bottom, black, transparent 85%)',

                WebkitMaskImage:
                  'linear-gradient(to bottom, black, transparent 85%)',

                pointerEvents: 'none'
              }}
            />

            {/* Animated ambient glow */}
            <Box
              sx={{
                position: 'absolute',
                width: {
                  xs: 320,
                  md: 600
                },
                height: {
                  xs: 320,
                  md: 600
                },
                borderRadius: '50%',

                background: `
          radial-gradient(
            circle,
            ${alpha(primary, 0.3)},
            ${alpha(secondary, 0.12)} 35%,
            transparent 70%
          )
        `,

                filter: 'blur(30px)',

                animation: 'themeLoaderPulse 2s ease-in-out infinite',

                pointerEvents: 'none'
              }}
            />

            {/* Expanding theme rings */}
            {[0, 1, 2].map((ring) => (
              <Box
                key={ring}
                sx={{
                  position: 'absolute',

                  width: {
                    xs: 180 + ring * 70,
                    md: 260 + ring * 100
                  },

                  height: {
                    xs: 180 + ring * 70,
                    md: 260 + ring * 100
                  },

                  borderRadius: '50%',

                  border: `1px solid ${alpha(
                    ring % 2 === 0 ? primary : secondary,
                    0.35
                  )}`,

                  animation: 'themeLoaderScale 3s ease-out infinite',

                  animationDelay: `${ring * 450}ms`,

                  pointerEvents: 'none'
                }}
              />
            ))}

            {/* Center theme icon */}
            <Stack
              spacing={2}
              sx={{
                position: 'relative',
                zIndex: 2,

                alignItems: 'center',
                justifyContent: 'center',

                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative',

                  width: {
                    xs: 92,
                    md: 116
                  },

                  height: {
                    xs: 92,
                    md: 116
                  },

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: '50%',

                  background: `
            linear-gradient(
              135deg,
              ${alpha(primary, 0.2)},
              ${alpha(secondary, 0.2)}
            )
          `,

                  border: `1px solid ${alpha('#ffffff', 0.16)}`,

                  boxShadow: `
            0 0 0 1px ${alpha(primary, 0.08)},
            0 0 60px ${alpha(primary, 0.25)},
            0 20px 60px ${alpha('#000000', 0.25)}
          `,

                  backdropFilter: 'blur(12px)',

                  animation: 'themeLoaderPulse 2s ease-in-out infinite'
                }}
              >
                {THEME_ICONS[themeSet] ? (
                  <Image
                    src={THEME_ICONS[themeSet]}
                    alt=""
                    width={68}
                    height={68}
                    style={{
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <PaletteOutlinedIcon
                    sx={{
                      fontSize: 52,
                      color: primary
                    }}
                  />
                )}

                {/* Rotating ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -8,

                    borderRadius: '50%',

                    border: `2px solid transparent`,

                    borderTopColor: primary,
                    borderRightColor: alpha(secondary, 0.8),

                    animation: 'themeLoaderSpin 1.4s linear infinite'
                  }}
                />
              </Box>

              <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#ffffff'
                  }}
                >
                  Cryptech Services
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#ffffff', 0.65)
                  }}
                >
                  {activeTheme?.label ?? 'Custom'}
                </Typography>
              </Stack>

              {/* Progress bar */}
              <Box
                sx={{
                  width: {
                    xs: 180,
                    sm: 240
                  },

                  height: 4,

                  overflow: 'hidden',

                  borderRadius: 99,

                  backgroundColor: alpha('#ffffff', 0.1)
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',

                    transformOrigin: 'left center',

                    borderRadius: 99,

                    background: `linear-gradient(
              90deg,
              ${primary},
              ${secondary}
            )`,

                    boxShadow: `0 0 15px ${alpha(primary, 0.5)}`,

                    animation: 'themeLoaderBar 3s linear forwards'
                  }}
                />
              </Box>
            </Stack>
          </Box>
        )}
        {/* ================================================================
            BACKGROUND GRID
        ================================================================ */}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,

            backgroundImage: `
              linear-gradient(
                ${alpha(primary, 0.075)} 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                ${alpha(primary, 0.075)} 1px,
                transparent 1px
              )
            `,

            backgroundSize: '48px 48px',

            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',

            WebkitMaskImage:
              'linear-gradient(to bottom, black, transparent 85%)',

            pointerEvents: 'none'
          }}
        />

        {/* ================================================================
            AMBIENT GLOW
        ================================================================ */}

        <Box
          sx={{
            position: 'absolute',

            width: {
              xs: 320,
              md: 600
            },

            height: {
              xs: 320,
              md: 600
            },

            top: {
              xs: -180,
              md: -300
            },

            left: '50%',

            transform: 'translateX(-50%)',

            borderRadius: '50%',

            background: `
              radial-gradient(
                circle at center,
                ${alpha(primary, 0.1)},
                transparent 65%
              )
            `,

            filter: {
              xs: 'blur(20px)',
              md: 'blur(30px)'
            },

            pointerEvents: 'none'
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 1,

            py: {
              xs: 4,
              sm: 6,
              md: 8
            }
          }}
        >
          {/* ================================================================
              HEADER
          ================================================================ */}

          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              mb: {
                xs: 4,
                md: 6
              }
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                borderRadius: 2,

                color: primary,

                backgroundColor: alpha(primary, 0.1),

                border: `1px solid ${alpha(primary, 0.2)}`,

                boxShadow: `
                  0 10px 35px
                  ${alpha(primary, 0.12)}
                `
              }}
            >
              <PaletteOutlinedIcon />
            </Box>

            <Stack spacing={0.75}>
              <Typography
                variant="overlineCustom"
                sx={{
                  color: primary,
                  fontWeight: 800,
                  letterSpacing: '0.16em'
                }}
              >
                THEME SYSTEM
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 850,
                  letterSpacing: '-0.04em',

                  fontSize: {
                    xs: '2.2rem',
                    sm: '3rem',
                    md: '4rem'
                  },

                  lineHeight: 1.05
                }}
              >
                Choose your theme.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 680,
                  mx: 'auto',
                  color: textSecondary,

                  fontSize: {
                    xs: '0.95rem',
                    md: '1.05rem'
                  },

                  lineHeight: 1.7
                }}
              >
                Explore the available visual systems and apply the one that best
                fits your interface.
              </Typography>
            </Stack>

            <Button
              variant="contained"
              disabled={isProceeding}
              endIcon={!isProceeding && <ArrowForwardRoundedIcon />}
              onClick={() => {
                if (isProceeding) return;

                setIsProceeding(true);

                window.setTimeout(() => {
                  setIsLoaderExiting(true);

                  window.setTimeout(() => {
                    router.push('/');
                  }, 500);
                }, 3000);
              }}
              sx={{
                minHeight: 46,
                px: 3,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 800,

                background: `linear-gradient(
      135deg,
      ${theme.colorScale[9]},
      ${theme.secondaryScale[9]}
    )`,

                boxShadow: `0 10px 28px ${alpha(theme.colorScale[9], 0.2)}`,

                '&:hover': {
                  background: `linear-gradient(
        135deg,
        ${theme.colorScale[10]},
        ${theme.secondaryScale[10]}
      )`
                }
              }}
            >
              Proceed
            </Button>
          </Stack>

          {/* ================================================================
              ACTIVE THEME
          ================================================================ */}

          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',

              mb: 3,

              p: {
                xs: 2,
                sm: 2.5,
                md: 3
              },

              borderRadius: {
                xs: 2.5,
                md: 3
              },

              background: `
                linear-gradient(
                  135deg,
                  ${alpha(primary, 0.25)},
                  ${alpha(secondary, 0.25)}
                ),
                ${surface}
              `,

              border: `1px solid ${alpha(primary, 0.2)}`,

              boxShadow: {
                xs: 'none',
                md: `
                  0 20px 60px
                  ${alpha('#000000', isDark ? 0.25 : 0.08)}
                `
              }
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                sm: 'row'
              }}
              spacing={2}
              sx={{
                alignItems: {
                  xs: 'stretch',
                  sm: 'center'
                },
                justifyContent: 'space-between'
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  minWidth: 0
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    flexShrink: 0,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    borderRadius: 2,

                    backgroundColor: alpha(primary, 0.1),

                    border: `1px solid ${alpha(primary, 0.2)}`
                  }}
                >
                  {THEME_ICONS[themeSet] && (
                    <Image
                      src={THEME_ICONS[themeSet]}
                      alt=""
                      width={38}
                      height={38}
                      style={{
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </Box>

                <Stack
                  spacing={0.35}
                  sx={{
                    minWidth: 0
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1.2
                      }}
                    >
                      {activeTheme?.label ?? 'Custom'}
                    </Typography>

                    <Chip
                      label="ACTIVE"
                      size="small"
                      icon={
                        <CheckIcon
                          sx={{
                            fontSize: 14
                          }}
                        />
                      }
                      sx={{
                        height: 22,

                        fontSize: '0.62rem',

                        fontWeight: 800,

                        backgroundColor: alpha(primary, 0.12),

                        color: primary,

                        border: `1px solid ${alpha(primary, 0.2)}`,

                        '& .MuiChip-icon': {
                          color: primary
                        }
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      color: textSecondary,
                      textTransform: 'capitalize'
                    }}
                  >
                    {activeTheme?.category ?? 'custom theme'}
                  </Typography>
                </Stack>
              </Stack>

              {/* Current colors */}

              {activeTheme && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    alignItems: 'center'
                  }}
                >
                  {[
                    activeTheme.color,
                    activeTheme.secondary,
                    activeTheme.gray,
                    activeTheme.background
                  ].map((color, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: {
                          xs: 28,
                          sm: 34
                        },

                        height: {
                          xs: 28,
                          sm: 34
                        },

                        borderRadius: 1.25,

                        backgroundColor: color,

                        border: `1px solid ${alpha(textPrimary, 0.12)}`,

                        boxShadow: `
                          inset 0 1px 0
                          ${alpha('#ffffff', 0.06)}
                        `
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* ================================================================
              CATEGORY NAVIGATION
          ================================================================ */}

          <Paper
            elevation={0}
            sx={{
              p: 0.75,

              mb: 3,

              borderRadius: 2.5,

              backgroundColor: theme.secondaryScale[4],

              border: `1px solid ${alpha(secondary, 0.14)}`,

              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeCategory}
              onChange={(_, value: string) => {
                setActiveCategory(value);
              }}
              variant="scrollable"
              scrollButtons={false}
              sx={{
                minHeight: 42,

                '& .MuiTabs-indicator': {
                  display: 'none'
                },

                '& .MuiTabs-flexContainer': {
                  gap: 0.5
                },

                '& .MuiTab-root': {
                  minHeight: 42,
                  minWidth: 'auto',

                  px: {
                    xs: 1.5,
                    sm: 2
                  },

                  borderRadius: 2,

                  textTransform: 'none',

                  fontSize: {
                    xs: 12,
                    sm: 13
                  },

                  fontWeight: 700,

                  color: textSecondary,

                  transition: 'background 180ms ease, color 180ms ease',

                  '&:hover': {
                    color: textPrimary,

                    backgroundColor: alpha(primary, 0.06)
                  }
                },

                '& .MuiTab-root.Mui-selected': {
                  color: '#ffffff',

                  background: `
                    linear-gradient(
                      135deg,
                      ${primary},
                      ${secondary}
                    )
                  `,

                  boxShadow: `
                    0 8px 24px
                    ${alpha(primary, 0.16)}
                  `
                }
              }}
            >
              <Tab
                value="all"
                disableRipple
                label={
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{
                      alignItems: 'center'
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        fontWeight: 'inherit'
                      }}
                    >
                      All Themes
                    </Typography>

                    <Box
                      component="span"
                      sx={{
                        minWidth: 20,
                        height: 20,
                        px: 0.5,

                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        borderRadius: 10,

                        fontSize: 9,
                        fontWeight: 800,

                        color:
                          activeCategory === 'all' ? '#ffffff' : textSecondary,

                        backgroundColor:
                          activeCategory === 'all'
                            ? alpha('#ffffff', 0.14)
                            : alpha(textSecondary, 0.08),

                        border: `1px solid ${
                          activeCategory === 'all'
                            ? alpha('#ffffff', 0.16)
                            : alpha(textSecondary, 0.1)
                        }`
                      }}
                    >
                      {items.length}
                    </Box>
                  </Stack>
                }
              />

              {categories.map((category) => {
                const count = items.filter(
                  ([, item]) => item.category === category
                ).length;

                const isSelected = activeCategory === category;

                return (
                  <Tab
                    key={category}
                    value={category}
                    disableRipple
                    label={
                      <Stack
                        direction="row"
                        spacing={0.75}
                        sx={{
                          alignItems: 'center'
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontSize: 'inherit',
                            fontWeight: 'inherit'
                          }}
                        >
                          {CATEGORY_LABELS[category] ?? category}
                        </Typography>

                        <Box
                          component="span"
                          sx={{
                            minWidth: 20,
                            height: 20,
                            px: 0.5,

                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                            borderRadius: 10,

                            fontSize: 9,
                            fontWeight: 800,

                            color: isSelected ? '#ffffff' : textSecondary,

                            backgroundColor: isSelected
                              ? alpha('#ffffff', 0.14)
                              : alpha(textSecondary, 0.08),

                            border: `1px solid ${
                              isSelected
                                ? alpha('#ffffff', 0.16)
                                : alpha(textSecondary, 0.1)
                            }`
                          }}
                        >
                          {count}
                        </Box>
                      </Stack>
                    }
                  />
                );
              })}
            </Tabs>
          </Paper>

          {/* ================================================================
              THEME GRID
          ================================================================ */}

          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))'
              },

              gap: {
                xs: 1.5,
                sm: 2,
                md: 2.5
              }
            }}
          >
            {filteredThemes.map(([key, item]) => {
              const isActive = themeSet === key;

              return (
                <ThemeCard
                  key={key}
                  themeKey={key}
                  item={item}
                  isActive={isActive}
                  onSelect={() => selectTheme(key)}
                />
              );
            })}
          </Box>

          {/* ================================================================
              BOTTOM INFO
          ================================================================ */}

          <Stack
            spacing={1}
            sx={{
              alignItems: 'center',
              textAlign: 'center',

              mt: {
                xs: 5,
                md: 7
              },

              pb: {
                xs: 3,
                md: 5
              }
            }}
          >
            <AutoAwesomeRoundedIcon
              sx={{
                fontSize: 20,
                color: primary
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: textSecondary
              }}
            >
              Select a theme to instantly update the entire design system.
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: alpha(textSecondary, 0.7)
              }}
            >
              {items.length} available themes
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

/* ==========================================================================
   THEME CARD
========================================================================== */

type ThemeCardProps = {
  themeKey: Exclude<ThemeKey, 'custom'>;
  item: ThemeItem;
  isActive: boolean;
  onSelect: () => void;
};

function ThemeCard({ themeKey, item, isActive, onSelect }: ThemeCardProps) {
  const theme = useTheme();

  const primary = item.color;
  const secondary = item.secondary;

  const textPrimary = theme.grayScale[12];
  const textSecondary = theme.grayScale[10];

  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      component="button"
      type="button"
      onClick={onSelect}
      elevation={0}
      aria-pressed={isActive}
      sx={{
        position: 'relative',

        width: '100%',

        p: 0,

        overflow: 'hidden',

        textAlign: 'left',

        cursor: 'pointer',

        borderRadius: {
          xs: 2.5,
          md: 3
        },

        color: textPrimary,

        backgroundColor: theme.secondaryScale[4],

        border: `1px solid ${
          isActive ? alpha(primary, 0.65) : alpha(theme.grayScale[12], 0.1)
        }`,

        boxShadow: isActive
          ? `
            0 18px 50px
            ${alpha(primary, 0.16)},
            0 0 0 1px
            ${alpha(primary, 0.08)}
          `
          : 'none',

        transition: `
          transform 220ms ease,
          border-color 220ms ease,
          box-shadow 220ms ease
        `,

        '&:hover': {
          transform: {
            xs: 'none',
            md: 'translateY(-5px)'
          },

          borderColor: alpha(primary, 0.5),

          boxShadow: `
            0 18px 50px
            ${alpha(primary, 0.14)}
          `
        },

        '&:focus-visible': {
          outline: `2px solid ${primary}`,
          outlineOffset: 3
        }
      }}
    >
      {/* ================================================================
          PREVIEW
      ================================================================ */}

      <Box
        sx={{
          position: 'relative',

          height: {
            xs: 150,
            sm: 160,
            md: 175
          },

          overflow: 'hidden',

          background: `
            radial-gradient(
              circle at center,
              ${alpha(primary, 0.12)},
              transparent 60%
            ),
            ${item.background}
          `
        }}
      >
        {/* Glow */}

        <Box
          sx={{
            position: 'absolute',

            width: 180,
            height: 180,

            top: -90,
            right: -50,

            borderRadius: '50%',

            background: `
              radial-gradient(
                circle,
                ${alpha(primary, 0.28)},
                transparent 68%
              )
            `,

            pointerEvents: 'none'
          }}
        />

        <Box
          sx={{
            position: 'absolute',

            width: 150,
            height: 150,

            bottom: -90,
            left: -50,

            borderRadius: '50%',

            background: `
              radial-gradient(
                circle,
                ${alpha(secondary, 0.2)},
                transparent 68%
              )
            `,

            pointerEvents: 'none'
          }}
        />

        {/* Mini interface */}

        <Box
          sx={{
            position: 'absolute',

            left: {
              xs: 18,
              sm: 20
            },

            right: {
              xs: 18,
              sm: 20
            },

            top: {
              xs: 18,
              sm: 20
            },

            bottom: {
              xs: 18,
              sm: 20
            },

            p: 1.25,

            borderRadius: 2,

            backgroundColor: alpha(item.background, 0.65),

            border: `1px solid ${alpha('#ffffff', 0.1)}`,

            boxShadow: `
              0 12px 30px
              ${alpha('#000000', 0.25)}
            `
          }}
        >
          <Stack spacing={1}>
            {/* Header */}

            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: 'center'
              }}
            >
              {[0, 1, 2].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',

                    backgroundColor: alpha('#ffffff', 0.4)
                  }}
                />
              ))}

              <Box
                sx={{
                  ml: 0.5,
                  width: '35%',
                  height: 5,

                  borderRadius: 1,

                  backgroundColor: alpha('#ffffff', 0.18)
                }}
              />
            </Stack>

            {/* Content */}

            <Box
              sx={{
                width: '62%',
                height: 9,

                borderRadius: 1,

                backgroundColor: alpha('#ffffff', 0.7)
              }}
            />

            <Box
              sx={{
                width: '82%',
                height: 5,

                borderRadius: 1,

                backgroundColor: alpha('#ffffff', 0.22)
              }}
            />

            {/* Main color */}

            <Box
              sx={{
                mt: 0.5,

                height: 48,

                borderRadius: 1.5,

                background: `
                  linear-gradient(
                    135deg,
                    ${primary},
                    ${secondary}
                  )
                `,

                boxShadow: `
                  inset 0 0 20px
                  ${alpha('#ffffff', 0.08)},
                  0 5px 18px
                  ${alpha(primary, 0.2)}
                `
              }}
            />

            {/* Buttons */}

            <Stack direction="row" spacing={0.75}>
              <Box
                sx={{
                  flex: 1,
                  height: 16,

                  borderRadius: 0.75,

                  backgroundColor: primary
                }}
              />

              <Box
                sx={{
                  width: '28%',
                  height: 16,

                  borderRadius: 0.75,

                  backgroundColor: alpha('#ffffff', 0.1),

                  border: `1px solid ${alpha('#ffffff', 0.1)}`
                }}
              />
            </Stack>
          </Stack>
        </Box>

        {/* Active badge */}

        {isActive && (
          <Box
            sx={{
              position: 'absolute',

              top: 10,
              right: 10,

              display: 'flex',
              alignItems: 'center',
              gap: 0.5,

              px: 1,
              py: 0.55,

              borderRadius: 99,

              color: '#ffffff',

              backgroundColor: alpha(primary, 0.9),

              border: `1px solid ${alpha('#ffffff', 0.18)}`,

              backdropFilter: 'blur(8px)',

              boxShadow: `
                0 6px 18px
                ${alpha(primary, 0.3)}
              `
            }}
          >
            <CheckIcon
              sx={{
                fontSize: 14
              }}
            />

            <Typography
              component="span"
              sx={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.08em',
                lineHeight: 1
              }}
            >
              ACTIVE
            </Typography>
          </Box>
        )}
      </Box>

      {/* ================================================================
          CONTENT
      ================================================================ */}

      <Stack
        spacing={1.5}
        sx={{
          p: {
            xs: 1.75,
            sm: 2
          }
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Stack
            spacing={0.25}
            sx={{
              minWidth: 0
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,

                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: textSecondary,
                textTransform: 'capitalize'
              }}
            >
              {item.category}
            </Typography>
          </Stack>

          <ArrowForwardRoundedIcon
            sx={{
              flexShrink: 0,

              fontSize: 19,

              color: isActive ? primary : alpha(textSecondary, 0.7),

              transition: 'transform 180ms ease',

              '.MuiPaper-root:hover &': {
                transform: 'translateX(3px)'
              }
            }}
          />
        </Stack>

        <Divider
          sx={{
            borderColor: alpha(textPrimary, 0.08)
          }}
        />

        {/* ==============================================================
            COLOR TOKENS
        ============================================================== */}

        <Stack direction="row" spacing={0.75}>
          {[
            {
              label: 'Primary',
              color: item.color
            },
            {
              label: 'Secondary',
              color: item.secondary
            },
            {
              label: 'Gray',
              color: item.gray
            },
            {
              label: 'Background',
              color: item.background
            }
          ].map((token) => (
            <Stack
              key={token.label}
              spacing={0.5}
              sx={{
                flex: 1,
                minWidth: 0
              }}
            >
              <Box
                sx={{
                  height: 28,

                  borderRadius: 1,

                  backgroundColor: token.color,

                  border: `1px solid ${alpha(
                    textPrimary,
                    isDark ? 0.12 : 0.08
                  )}`,

                  boxShadow: isDark
                    ? `
                      0 2px 8px
                      ${alpha('#000000', 0.18)}
                    `
                    : 'none'
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  color: textSecondary,

                  fontSize: '0.58rem',

                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {token.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* ==============================================================
            SELECT BUTTON
        ============================================================== */}

        <Box
          sx={{
            mt: 0.25,

            minHeight: 38,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,

            borderRadius: 1.5,

            color: isActive ? '#ffffff' : primary,

            backgroundColor: isActive ? primary : alpha(primary, 0.08),

            border: `1px solid ${alpha(primary, isActive ? 0.7 : 0.18)}`,

            fontSize: 12,
            fontWeight: 800,

            transition: 'background-color 180ms ease, color 180ms ease',

            '.MuiPaper-root:hover &': {
              backgroundColor: isActive ? primary : alpha(primary, 0.14)
            }
          }}
        >
          {isActive ? (
            <>
              <CheckIcon
                sx={{
                  fontSize: 16
                }}
              />
              Current Theme
            </>
          ) : (
            <>
              <ColorLensOutlinedIcon
                sx={{
                  fontSize: 16
                }}
              />
              Use Theme
            </>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
