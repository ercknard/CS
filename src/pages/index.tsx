'use client';

import Head from 'next/head';
import React from 'react';

import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Divider
} from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';

import Navbar from '@/theme/layout/Navbar';
import SkyEffects from '@/theme/common/SkyEffects';
import { AppButton, AppChip } from '@/theme/components/CustomComponents';

import Footer from '@/components/Footer';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import GameServers from '@/components/GameServers';
import FAQs from '@/components/FAQS';
import Team from '@/components/Team';
import SecurityServices from '@/components/SecurityServices';
import ContactUsPage from '@/components/ContactUsPage';
import HomeMarquee from '@/components/HomeMarquee';
import GithubSection from '@/components/GithubSection';

import { useThemeContext } from '@/contexts/themeContext';
import supabase from '@/lib/supabase';

type HomeSectionKey =
  | 'hero'
  | 'marquee_top'
  | 'about'
  | 'services'
  | 'marquee_mid'
  | 'security'
  | 'projects'
  | 'game_servers'
  | 'team'
  | 'github'
  | 'faqs'
  | 'contact'
  | 'footer';

type HomeSection = {
  section_key: HomeSectionKey;
  title: string;
  is_show: boolean;
  display_order: number;
};

const DEFAULT_SECTION_VISIBILITY: Record<HomeSectionKey, boolean> = {
  hero: true,
  marquee_top: true,
  about: true,
  services: true,
  marquee_mid: true,
  security: true,
  projects: true,
  game_servers: true,
  team: true,
  github: true,
  faqs: true,
  contact: true,
  footer: true
};

/**
 * Decorative section separator.
 */
function SectionDivider() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const primary = theme.colorScale?.[9] ?? theme.palette.primary.main;
  const secondary = theme.secondaryScale?.[9] ?? theme.palette.secondary.main;

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'relative',
        display: { xs: 'none', md: 'block' },
        height: { xs: 24, md: 38 },
        overflow: 'hidden',
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '8%',
          right: '8%',
          top: '50%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${alpha(primary, 0.5)}, ${alpha(secondary, 0.5)}, transparent)`
        },
        '&::after': {
          content: '"❖"',
          position: 'absolute',
          width: 6,
          height: 6,
          top: 'calc(50% - 11px)',
          left: '50%',
          color: primary,
          boxShadow: `0 0 14px ${alpha(primary, isDark ? 0.65 : 0.35)}`
        }
      }}
    />
  );
}

/**
 * Lightweight animated circuit illustration.
 */
function HeroCircuit({
  primary,
  secondary,
  isDark
}: {
  primary: string;
  secondary: string;
  isDark: boolean;
}) {
  const opacity = isDark ? 0.75 : 0.9;

  const traces = [
    'M70 100 H145 V150 H205',
    'M40 220 H105 V180 H165 V125',
    'M340 45 V105 H285 V155 H245',
    'M390 135 H330 V190 H275',
    'M60 300 H130 V255 H195',
    'M390 270 H320 V310 H260 V345',
    'M110 35 V75 H175 V110',
    'M365 360 V325 H320',
    'M25 165 H75 V135 H120',
    'M235 30 V70 H275 V105'
  ];

  const nodes = [
    [145, 100],
    [205, 150],
    [105, 220],
    [165, 180],
    [165, 125],
    [340, 105],
    [285, 155],
    [245, 155],
    [130, 300],
    [195, 255],
    [320, 310],
    [260, 345],
    [175, 75],
    [275, 105],
    [75, 135],
    [365, 325]
  ];

  return (
    <Box
      component="svg"
      viewBox="0 0 420 390"
      role="img"
      aria-label="Abstract technology network illustration"
      sx={{
        display: 'block',
        width: '100%',
        maxWidth: 480,
        height: 'auto',
        overflow: 'visible',
        color: primary,
        opacity,
        '& .hero-trace': {
          strokeDasharray: '5 8',
          animation: 'heroCircuitFlow 24s linear infinite'
        },
        '& .hero-node': {
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'heroNodePulse 4s ease-in-out infinite'
        },
        '@keyframes heroCircuitFlow': {
          to: { strokeDashoffset: -180 }
        },
        '@keyframes heroNodePulse': {
          '0%, 100%': { opacity: 0.45, transform: 'scale(0.85)' },
          '50%': { opacity: 1, transform: 'scale(1.15)' }
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& .hero-trace, & .hero-node': {
            animation: 'none'
          }
        }
      }}
    >
      <defs>
        <linearGradient id="heroCircuitGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>

        <radialGradient id="heroCircuitGlow">
          <stop
            offset="0%"
            stopColor={primary}
            stopOpacity={isDark ? 0.22 : 0.13}
          />
          <stop offset="100%" stopColor={primary} stopOpacity="0" />
        </radialGradient>

        <pattern
          id="heroCircuitGrid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>

      <rect width="420" height="390" fill="url(#heroCircuitGrid)" />

      <circle cx="220" cy="190" r="175" fill="url(#heroCircuitGlow)" />

      <circle
        cx="220"
        cy="190"
        r="125"
        fill="none"
        stroke="url(#heroCircuitGradient)"
        strokeWidth="1"
        opacity="0.28"
      />

      <circle
        cx="220"
        cy="190"
        r="95"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 9"
        opacity="0.35"
      />

      <g
        fill="none"
        stroke="url(#heroCircuitGradient)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {traces.map((path, index) => (
          <path
            key={path}
            className="hero-trace"
            d={path}
            style={{ animationDelay: `${index * -1.3}s` }}
          />
        ))}
      </g>

      <g fill="currentColor">
        {nodes.map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className="hero-node"
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 3 : 1.8}
            style={{ animationDelay: `${index * -0.25}s` }}
          />
        ))}
      </g>

      <g transform="translate(220 190)">
        <circle
          r="65"
          fill={alpha(primary, isDark ? 0.09 : 0.055)}
          stroke={alpha(primary, 0.6)}
          strokeWidth="1.2"
        />

        <circle
          r="48"
          fill="none"
          stroke={alpha(secondary, 0.7)}
          strokeWidth="1"
          strokeDasharray="4 7"
        />

        <path
          d="M-27 0 H27 M0 -27 V27"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />

        <rect
          x="-21"
          y="-21"
          width="42"
          height="42"
          rx="10"
          fill={alpha(primary, isDark ? 0.2 : 0.1)}
          stroke="url(#heroCircuitGradient)"
          strokeWidth="1.5"
          transform="rotate(45)"
        />

        <path
          d="M-8 -8 L-2 -8 L-9 2 L0 2 L-5 11 L10 -4 L2 -4 L7 -11"
          fill="none"
          stroke={primary}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g fill="currentColor" fontFamily="monospace" fontSize="9" opacity="0.7">
        <text x="22" y="25">
          SYS / 001
        </text>
        <text x="302" y="35">
          NETWORK_ACTIVE
        </text>
        <text x="260" y="370">
          CONNECTED // 100%
        </text>
        <text x="18" y="360">
          CRYPTECH_SERVICES
        </text>
      </g>
    </Box>
  );
}

/**
 * Main homepage.
 */
export default function Home() {
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();
  const isDark = theme.palette.mode === 'dark';

  const [sectionVisibility, setSectionVisibility] = React.useState<
    Record<HomeSectionKey, boolean>
  >(DEFAULT_SECTION_VISIBILITY);

  const [sectionsLoaded, setSectionsLoaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function loadSectionVisibility() {
      const { data, error } = await supabase
        .from('sc_home_sections')
        .select('section_key, title, is_show, display_order')
        .order('display_order', { ascending: true });

      if (error) {
        console.error(
          'Failed to load homepage section visibility:',
          error.message
        );

        if (isMounted) {
          setSectionsLoaded(true);
        }

        return;
      }

      if (!isMounted) return;

      const rows = (data ?? []) as HomeSection[];

      setSectionVisibility((previous) => {
        const next = { ...previous };

        for (const section of rows) {
          if (section.section_key in next) {
            next[section.section_key] = section.is_show;
          }
        }

        return next;
      });

      setSectionsLoaded(true);
    }

    loadSectionVisibility();

    return () => {
      isMounted = false;
    };
  }, []);

  const isSectionVisible = (key: HomeSectionKey) =>
    sectionVisibility[key] !== false;

  const primary = theme.colorScale?.[9] ?? theme.palette.primary.main;
  const primaryStrong = theme.colorScale?.[8] ?? theme.palette.primary.dark;
  const secondary = theme.secondaryScale?.[9] ?? theme.palette.secondary.main;

  const background =
    theme.backgroundScale?.[1] ?? theme.palette.background.default;

  const surface = theme.backgroundScale?.[3] ?? theme.palette.background.paper;

  const textPrimary = theme.grayScale?.[12] ?? theme.palette.text.primary;
  const textSecondary = theme.grayScale?.[10] ?? theme.palette.text.secondary;

  const services = [
    {
      icon: <CodeRoundedIcon />,
      title: 'Web & Software',
      description: 'Modern websites and software built around your needs.'
    },
    {
      icon: <SecurityRoundedIcon />,
      title: 'Security & Infrastructure',
      description: 'Practical security and reliable technical foundations.'
    },
    {
      icon: <DevicesRoundedIcon />,
      title: 'Digital Experiences',
      description: 'Intuitive interfaces that make technology easier to use.'
    }
  ];

  /*
   * Keep section dividers only between sections that are visible.
   */
  const contentSections: {
    key: HomeSectionKey;
    component: React.ReactNode;
  }[] = [
    {
      key: 'about',
      component: <AboutUs />
    },
    {
      key: 'services',
      component: <Services />
    },
    {
      key: 'security',
      component: <SecurityServices />
    },
    {
      key: 'projects',
      component: <Projects />
    },
    {
      key: 'game_servers',
      component: <GameServers />
    },
    {
      key: 'team',
      component: <Team />
    },
    {
      key: 'github',
      component: <GithubSection />
    },
    {
      key: 'faqs',
      component: <FAQs />
    },
    {
      key: 'contact',
      component: <ContactUsPage />
    }
  ];

  const visibleContentSections = contentSections.filter(({ key }) =>
    isSectionVisible(key)
  );

  return (
    <>
      <Head>
        <title>Cryptech Services | IT & Digital Solutions</title>
        <meta
          name="description"
          content="Cryptech Services delivers web development, digital design, IT infrastructure, and security solutions for a connected world."
        />
        <meta name="theme-color" content={background} />
      </Head>

      <Navbar onToggleTheme={toggleTheme} />

      {/* HERO */}
      {isSectionVisible('hero') && (
        <Box
          component="main"
          sx={{
            position: 'relative',
            isolation: 'isolate',
            overflow: 'hidden',
            minHeight: '95vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textPrimary,
            backgroundColor: background,
            backgroundImage: `
              radial-gradient(ellipse at 75% 38%, ${alpha(primary, isDark ? 0.17 : 0.11)} 0%, transparent 43%),
              radial-gradient(ellipse at 5% 90%, ${alpha(secondary, isDark ? 0.12 : 0.07)} 0%, transparent 36%)
            `
          }}
        >
          {/* Atmospheric background */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: -2,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <SkyEffects color={primary} />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: isDark ? 0.12 : 0.07,
                backgroundImage: `
                  linear-gradient(${alpha(primaryStrong, 0.5)} 1px, transparent 1px),
                  linear-gradient(90deg, ${alpha(primaryStrong, 0.5)} 1px, transparent 1px)
                `,
                backgroundSize: '54px 54px',
                maskImage:
                  'linear-gradient(to bottom, black 0%, transparent 88%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 0%, transparent 88%)'
              }}
            />
          </Box>

          <Container
            maxWidth="xl"
            sx={{
              position: 'relative',
              py: { xs: 7, sm: 9, md: 12, lg: 14 }
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  md: 'minmax(0, 1.08fr) minmax(0, 0.92fr)'
                },
                alignItems: 'center',
                gap: { xs: 5, md: 4, lg: 7 }
              }}
            >
              {/* Hero copy */}
              <Stack
                spacing={{ xs: 2.5, md: 3 }}
                sx={{ position: 'relative', zIndex: 1, maxWidth: 760 }}
              >
                <Stack
                  direction="row"
                  spacing={1.25}
                  sx={{ alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 2,
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${primary}, ${secondary})`
                    }}
                  />

                  <Typography
                    sx={{
                      color: textSecondary,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Cryptech Services / IT Solutions Group
                  </Typography>
                </Stack>

                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: 'clamp(2.65rem, 10vw, 4rem)',
                      sm: '4.4rem',
                      md: 'clamp(3.4rem, 5vw, 5.4rem)',
                      xl: '5.8rem'
                    },
                    lineHeight: { xs: 1.02, md: 0.99 },
                    letterSpacing: '-0.068em',
                    fontWeight: 850,
                    maxWidth: 780,
                    '& .hero-highlight': {
                      display: 'block',
                      color: primary,
                      background: `linear-gradient(105deg, ${primary} 10%, ${secondary} 95%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }
                  }}
                >
                  Technology that
                  <Box component="span" className="hero-highlight">
                    moves you forward.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 555,
                    color: textSecondary,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.9
                  }}
                >
                  We design, develop, and deliver digital solutions that help
                  businesses work smarter, connect better, and grow with
                  confidence.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    alignItems: { xs: 'stretch', sm: 'center' },
                    pt: 0.5
                  }}
                >
                  <AppButton
                    component="a"
                    href="#contact-form"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      minHeight: 52,
                      px: 2.75,
                      borderRadius: 2,
                      boxShadow: `0 10px 30px ${alpha(primary, isDark ? 0.24 : 0.22)}`
                    }}
                  >
                    Start a Project
                  </AppButton>

                  <AppButton
                    component="a"
                    href="#services"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    endIcon={<NorthEastRoundedIcon />}
                    sx={{
                      minHeight: 52,
                      px: 2.75,
                      borderRadius: 2,
                      borderColor: alpha(secondary, 0.4)
                    }}
                  >
                    Explore Our Services
                  </AppButton>
                </Stack>

                <Divider
                  sx={{
                    maxWidth: 520,
                    my: { xs: 0.5, md: 1 },
                    borderColor: alpha(secondary, 0.18)
                  }}
                />

                <Stack
                  direction="row"
                  spacing={2.5}
                  useFlexGap
                  sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                >
                  {[
                    { icon: <CodeRoundedIcon />, label: 'Development' },
                    { icon: <HubRoundedIcon />, label: 'IT Solutions' },
                    { icon: <SecurityRoundedIcon />, label: 'Security' }
                  ].map((item) => (
                    <Stack
                      key={item.label}
                      direction="row"
                      spacing={0.8}
                      sx={{ alignItems: 'center' }}
                    >
                      <Box sx={{ display: 'flex', color: primary }}>
                        {item.icon}
                      </Box>

                      <Typography
                        sx={{
                          color: textSecondary,
                          fontSize: '0.78rem',
                          fontWeight: 650
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {/* Hero visual */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 560,
                  minWidth: 0,
                  justifySelf: { xs: 'center', md: 'end' }
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    width: '85%',
                    aspectRatio: '1',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(primary, isDark ? 0.16 : 0.1)} 0%, ${alpha(secondary, 0.05)} 45%, transparent 72%)`,
                    filter: { xs: 'none', md: 'blur(12px)' }
                  }}
                />

                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: { xs: 3, md: 4 },
                    backgroundColor: alpha(surface, isDark ? 0.82 : 0.88),
                    border: `1px solid ${alpha(secondary, 0.22)}`,
                    backdropFilter: { xs: 'none', md: 'blur(16px)' },
                    boxShadow: `0 28px 80px ${alpha('#000000', isDark ? 0.2 : 0.08)}`,
                    transition: 'border-color 250ms ease, transform 250ms ease',
                    '&:hover': {
                      borderColor: alpha(primary, 0.45),
                      transform: { xs: 'none', md: 'translateY(-4px)' }
                    }
                  }}
                >
                  <Stack spacing={2.25}>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.2}
                        sx={{ alignItems: 'center', minWidth: 0 }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            flexShrink: 0,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            color: '#fff',
                            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                            boxShadow: `0 8px 24px ${alpha(primary, 0.25)}`
                          }}
                        >
                          <AutoAwesomeRoundedIcon />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{ fontWeight: 800, fontSize: '0.9rem' }}
                          >
                            Digital solutions
                          </Typography>

                          <Typography
                            sx={{ color: textSecondary, fontSize: '0.73rem' }}
                          >
                            Engineered for what&apos;s next
                          </Typography>
                        </Box>
                      </Stack>

                      <AppChip label="INNOVATION" color="primary" />
                    </Stack>

                    <Box
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 3,
                        border: `1px solid ${alpha(primary, 0.18)}`,
                        background: `linear-gradient(145deg, ${alpha(primary, isDark ? 0.11 : 0.07)}, ${alpha(secondary, isDark ? 0.1 : 0.05)}), ${background}`
                      }}
                    >
                      <HeroCircuit
                        primary={primary}
                        secondary={secondary}
                        isDark={isDark}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          left: 12,
                          bottom: 12,
                          px: 1.25,
                          py: 0.8,
                          borderRadius: 1.5,
                          bgcolor: alpha(surface, 0.9),
                          border: `1px solid ${alpha(primary, 0.2)}`
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.8}
                          sx={{ alignItems: 'center' }}
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              bgcolor: '#30A46C'
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              letterSpacing: '0.08em'
                            }}
                          >
                            SYSTEMS CONNECTED
                          </Typography>
                        </Stack>
                      </Box>

                      <Typography
                        sx={{
                          position: 'absolute',
                          right: 12,
                          bottom: 13,
                          color: textSecondary,
                          fontSize: '0.64rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        CTS / 001
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          pl: 0.25
                        }}
                      >
                        {[primary, secondary, alpha(primary, 0.55)].map(
                          (color, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 27,
                                height: 27,
                                ml: index === 0 ? 0 : -0.65,
                                borderRadius: '50%',
                                bgcolor: color,
                                border: `2px solid ${surface}`
                              }}
                            />
                          )
                        )}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{ fontWeight: 800, fontSize: '0.8rem' }}
                        >
                          One team. Connected solutions.
                        </Typography>

                        <Typography
                          sx={{ color: textSecondary, fontSize: '0.72rem' }}
                        >
                          From first idea to final delivery.
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>

                {/* Floating information card */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1.1,
                    left: { sm: -12, md: 300 },
                    bottom: { sm: 22, md: -20 },
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2.5,
                    bgcolor: surface,
                    border: `1px solid ${alpha(primary, 0.25)}`,
                    boxShadow: `0 12px 34px ${alpha('#000000', 0.1)}`
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 1.5,
                      bgcolor: alpha(primary, 0.12),
                      color: primary
                    }}
                  >
                    <TerminalRoundedIcon />
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.76rem' }}>
                      Technology with purpose
                    </Typography>

                    <Typography
                      sx={{ color: textSecondary, fontSize: '0.68rem' }}
                    >
                      Practical by design
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Service highlights */}
            <Box
              sx={{
                mt: { xs: 7, md: 10 },
                pt: { xs: 3, md: 4 },
                borderTop: `1px solid ${alpha(secondary, 0.18)}`
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(3, minmax(0, 1fr))'
                  },
                  gap: { xs: 2, md: 3 }
                }}
              >
                {services.map((service, index) => (
                  <Stack
                    key={service.title}
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: 'flex-start',
                      p: { xs: 1.5, md: 2 },
                      borderRadius: 2.5,
                      transition: 'background-color 200ms ease',
                      '&:hover': {
                        bgcolor: alpha(primary, isDark ? 0.07 : 0.045)
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 2,
                        color: index === 1 ? secondary : primary,
                        bgcolor: alpha(index === 1 ? secondary : primary, 0.1)
                      }}
                    >
                      {service.icon}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          mb: 0.5,
                          fontWeight: 800,
                          fontSize: '0.9rem'
                        }}
                      >
                        {service.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: textSecondary,
                          fontSize: '0.79rem',
                          lineHeight: 1.7
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* TOP MARQUEE */}
      {isSectionVisible('marquee_top') && (
        <>
          <HomeMarquee />
        </>
      )}

      {/* ABOUT */}
      {isSectionVisible('about') && <AboutUs />}

      {/* SERVICES */}
      {isSectionVisible('services') && (
        <>
          <SectionDivider />
          <Services />
        </>
      )}

      {/* MIDDLE MARQUEE */}
      {isSectionVisible('marquee_mid') && (
        <>
          <SectionDivider />
          <HomeMarquee />
        </>
      )}

      {/* SECURITY SERVICES */}
      {isSectionVisible('security') && (
        <>
          <SectionDivider />
          <SecurityServices />
        </>
      )}

      {/* PROJECTS */}
      {isSectionVisible('projects') && (
        <>
          <SectionDivider />
          <Projects />
        </>
      )}

      {/* GAME SERVERS */}
      {isSectionVisible('game_servers') && (
        <>
          <SectionDivider />
          <GameServers />
        </>
      )}

      {/* TEAM */}
      {isSectionVisible('team') && (
        <>
          <SectionDivider />
          <Team />
        </>
      )}

      {/* GITHUB */}
      {isSectionVisible('github') && (
        <>
          <SectionDivider />
          <GithubSection />
        </>
      )}

      {/* FAQS */}
      {isSectionVisible('faqs') && (
        <>
          <SectionDivider />
          <FAQs />
        </>
      )}

      {/* CONTACT */}
      {isSectionVisible('contact') && (
        <>
          <SectionDivider />
          <ContactUsPage />
        </>
      )}

      {/* FOOTER */}
      {isSectionVisible('footer') && (
        <>
          <SectionDivider />
          <Footer />
        </>
      )}
    </>
  );
}
