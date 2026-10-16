'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const theme = useTheme();
  const router = useRouter();

  const colorScale = theme.colorScale ?? [];
  const secondaryScale = theme.secondaryScale ?? [];
  const grayScale = theme.grayScale ?? [];
  const backgroundScale = theme.backgroundScale ?? [];

  const isDark = theme.palette.mode === 'dark';

  const primary = colorScale[9] ?? theme.palette.primary.main;
  const primaryLight = colorScale[6] ?? theme.palette.primary.light;
  const secondary = secondaryScale[9] ?? theme.palette.secondary.main;
  const background = backgroundScale[5] ?? theme.palette.background.default;
  const surface = backgroundScale[3] ?? theme.palette.background.paper;
  const gray = grayScale[9] ?? theme.palette.divider;
  const muted = grayScale[10] ?? theme.palette.text.secondary;

  return (
    <Box
      component="main"
      sx={{
        minHeight: '75dvh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: background,
        color: 'text.primary',
        isolation: 'isolate',
        py: { xs: 8, md: 10 },
        '&::before': {
          content: '""',
          position: 'absolute',
          zIndex: -1,
          width: { xs: 320, md: 650 },
          height: { xs: 320, md: 650 },
          top: { xs: '-8%', md: '-25%' },
          right: { xs: '-35%', md: '-12%' },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(primary, isDark ? 0.13 : 0.08)} 0%, transparent 70%)`,
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          zIndex: -1,
          width: { xs: 280, md: 500 },
          height: { xs: 280, md: 500 },
          bottom: { xs: '-12%', md: '-25%' },
          left: { xs: '-35%', md: '-10%' },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(secondary, isDark ? 0.1 : 0.06)} 0%, transparent 70%)`,
          pointerEvents: 'none'
        }
      }}
    >
      {/* Subtle technical background */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          opacity: isDark ? 0.2 : 0.35,
          backgroundImage: `
            linear-gradient(${alpha(gray, 0.1)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(gray, 0.1)} 1px, transparent 1px)
          `,
          backgroundSize: { xs: '32px 32px', md: '48px 48px' },
          maskImage:
            'linear-gradient(to bottom, transparent, black 18%, black 80%, transparent)'
        }}
      />

      <Container maxWidth="lg">
        <Stack
          spacing={{ xs: 6, md: 8 }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Brand identifier */}
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignSelf: 'flex-start', alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2,
                bgcolor: alpha(primary, 0.1),
                border: `1px solid ${alpha(primary, 0.25)}`,
                color: primary
              }}
            >
              <TerminalRoundedIcon />
            </Box>

            <Stack spacing={0}>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  lineHeight: 1.5
                }}
              >
                CRYPTECH
              </Typography>

              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  lineHeight: 1.5
                }}
              >
                SERVICES
              </Typography>
            </Stack>
          </Stack>

          {/* Error content */}
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
              alignItems: 'center',
              gap: { xs: 6, md: 8 }
            }}
          >
            {/* Left: Message and actions */}
            <Stack
              spacing={3}
              sx={{
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                order: { xs: 2, md: 1 }
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  border: `1px solid ${alpha(primary, 0.25)}`,
                  borderRadius: 99,
                  px: 1.5,
                  py: 0.75,
                  bgcolor: alpha(primary, 0.07)
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: primary,
                    boxShadow: `0 0 12px ${alpha(primary, 0.5)}`
                  }}
                />

                <Typography
                  sx={{
                    color: primary,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  Error 404 · Page not found
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: '2.5rem',
                      sm: '3.5rem',
                      md: 'clamp(3rem, 5vw, 4.5rem)'
                    },
                    fontWeight: 900,
                    letterSpacing: '-0.065em',
                    lineHeight: 1.05
                  }}
                >
                  Looks like
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'inline', md: 'block' },
                      color: primary
                    }}
                  >
                    {' '}
                    you took a wrong turn.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 460,
                    color: 'text.secondary',
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    lineHeight: 1.85
                  }}
                >
                  The page you're looking for isn't here. It may have been
                  moved, renamed, or no longer exists. Let's get you back on
                  track.
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  pt: 1
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeOutlinedIcon />}
                  onClick={() => router.push('/')}
                  sx={{
                    minHeight: 48,
                    px: 3,
                    borderRadius: 2.5,
                    fontWeight: 750,
                    textTransform: 'none',
                    boxShadow: `0 8px 24px ${alpha(primary, 0.2)}`,
                    '&:hover': {
                      boxShadow: `0 10px 30px ${alpha(primary, 0.3)}`
                    }
                  }}
                >
                  Back to homepage
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => router.back()}
                  sx={{
                    minHeight: 48,
                    px: 3,
                    borderRadius: 2.5,
                    borderColor: alpha(gray, 0.5),
                    color: 'text.primary',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: primary,
                      bgcolor: alpha(primary, 0.05)
                    }
                  }}
                >
                  Go back
                </Button>
              </Stack>

              <Typography
                sx={{
                  pt: 1,
                  color: 'text.disabled',
                  fontSize: '0.75rem',
                  lineHeight: 1.7
                }}
              >
                Need assistance? Return home to explore our services.
              </Typography>
            </Stack>

            {/* Right: Technical error illustration */}
            <Box
              aria-label="404 error illustration"
              role="img"
              sx={{
                position: 'relative',
                order: { xs: 1, md: 2 },
                width: '100%',
                maxWidth: 470,
                justifySelf: { xs: 'center', md: 'end' },
                aspectRatio: '1 / 0.92'
              }}
            >
              {/* Outer frame */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: '5%',
                  border: `1px solid ${alpha(gray, 0.25)}`,
                  borderRadius: 5,
                  transform: 'rotate(-3deg)',
                  bgcolor: alpha(surface, isDark ? 0.2 : 0.45)
                }}
              />

              {/* Main panel */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: '10%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  border: `1px solid ${alpha(primary, 0.22)}`,
                  borderRadius: 4,
                  bgcolor: alpha(surface, isDark ? 0.82 : 0.9),
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 24px 80px ${alpha('#000000', isDark ? 0.2 : 0.07)}`
                }}
              >
                {/* Panel header */}
                <Stack
                  direction="row"
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${alpha(gray, 0.18)}`,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack direction="row" spacing={0.75}>
                    {[primary, secondary, gray].map((color, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: alpha(color, 0.8)
                        }}
                      />
                    ))}
                  </Stack>

                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                      letterSpacing: '0.06em'
                    }}
                  >
                    SYSTEM / 404
                  </Typography>
                </Stack>

                {/* Main 404 graphic */}
                <Stack
                  sx={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    px: 2,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      width: '80%',
                      aspectRatio: '1',
                      borderRadius: '50%',
                      border: `1px solid ${alpha(primary, 0.14)}`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: '12%',
                        border: `1px dashed ${alpha(secondary, 0.3)}`,
                        borderRadius: '50%'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: '26%',
                        border: `1px solid ${alpha(primary, 0.12)}`,
                        borderRadius: '50%'
                      }
                    }}
                  />

                  <Typography
                    component="span"
                    sx={{
                      position: 'relative',
                      fontFamily: 'monospace',
                      fontSize: { xs: '5.5rem', sm: '7rem', md: '7.5rem' },
                      fontWeight: 900,
                      letterSpacing: '-0.1em',
                      lineHeight: 1,
                      color: 'transparent',
                      WebkitTextStroke: `1px ${alpha(primary, 0.8)}`,
                      textShadow: `0 0 50px ${alpha(primary, 0.12)}`
                    }}
                  >
                    404
                  </Typography>

                  <Box
                    sx={{
                      position: 'relative',
                      mt: 1.5,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      bgcolor: alpha(primary, 0.08),
                      border: `1px solid ${alpha(primary, 0.2)}`
                    }}
                  >
                    <Typography
                      sx={{
                        color: primary,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {'>'} route_not_found
                    </Typography>
                  </Box>

                  {/* Orbit markers */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '23%',
                      right: '20%',
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      bgcolor: secondary,
                      boxShadow: `0 0 18px ${alpha(secondary, 0.65)}`
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '23%',
                      left: '19%',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: primaryLight,
                      boxShadow: `0 0 14px ${alpha(primaryLight, 0.7)}`
                    }}
                  />
                </Stack>

                {/* Panel footer */}
                <Stack
                  direction="row"
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderTop: `1px solid ${alpha(gray, 0.18)}`,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography
                    sx={{
                      color: muted,
                      fontSize: '0.65rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    STATUS: NOT FOUND
                  </Typography>

                  <ArrowOutwardRoundedIcon
                    sx={{ fontSize: 16, color: alpha(primary, 0.8) }}
                  />
                </Stack>
              </Box>

              {/* Floating status chip */}
              <Box
                sx={{
                  position: 'absolute',
                  right: { xs: 0, sm: '-1%' },
                  top: '13%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  border: `1px solid ${alpha(gray, 0.25)}`,
                  borderRadius: 2,
                  bgcolor: surface,
                  boxShadow: `0 8px 28px ${alpha('#000000', 0.08)}`
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: '#E5484D'
                  }}
                />

                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}
                >
                  Route unavailable
                </Typography>
              </Box>

              {/* Floating coordinate label */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '9%',
                  left: { xs: 0, sm: '-2%' },
                  px: 1.5,
                  py: 1,
                  border: `1px solid ${alpha(gray, 0.22)}`,
                  borderRadius: 2,
                  bgcolor: surface,
                  boxShadow: `0 8px 28px ${alpha('#000000', 0.06)}`
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    fontFamily: 'monospace'
                  }}
                >
                  COORDINATES: UNKNOWN
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}

            sx={{
              width: '100%',
              pt: 3,
              borderTop: `1px solid ${alpha(gray, 0.2)}`,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              © {new Date().getFullYear()} Cryptech Services
            </Typography>

            <Typography
              sx={{
                color: 'text.disabled',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}
            >
              Built with precision. Driven by technology.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
