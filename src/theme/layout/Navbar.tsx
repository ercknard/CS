'use client';

import * as React from 'react';

import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';

import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';

import { useThemeContext } from '@/contexts/themeContext';
import { THEME_SETS } from '@/theme/theme';

interface NavbarProps {
  onToggleTheme: () => void;
}

/**
 * Update this URL to your actual GitHub organization or profile.
 */
const GITHUB_URL = 'https://github.com/CryptechServices';

const navItems = [
  {
    label: 'About',
    href: '/#about',
    section: 'about',
    icon: BusinessCenterRoundedIcon
  },
  {
    label: 'Services',
    href: '/#services',
    section: 'services',
    icon: DesignServicesRoundedIcon
  },
  {
    label: 'Security',
    href: '/#security',
    section: 'security',
    icon: ShieldRoundedIcon
  },
  // {
  //   label: 'Projects',
  //   href: '#work',
  //   section: 'projects',
  //   icon: FolderOpenRoundedIcon
  // },
  // {
  //   label: 'Games',
  //   href: '#game-servers',
  //   section: 'games',
  //   icon: SportsEsportsRoundedIcon
  // },
  {
    label: 'Team',
    href: '/#team',
    section: 'team',
    icon: GroupsRoundedIcon
  }
  // {
  //   label: 'FAQs',
  //   href: '/#faqs',
  //   section: 'faqs',
  //   icon: HelpOutlineRoundedIcon
  // }
];
type ThemeKey = keyof typeof THEME_SETS;

export default function Navbar({ onToggleTheme }: NavbarProps) {
  const theme = useTheme();
  const pathname = usePathname();

  const isDark = theme.palette.mode === 'dark';
  const [scrollProgress, setScrollProgress] = React.useState(0);
  // Use the drawer on tablets as well as mobile devices.
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const primary = theme.colorScale?.[9] ?? theme.palette.primary.main;

  const secondary = theme.secondaryScale?.[9] ?? theme.palette.secondary.main;

  const headingColor = theme.grayScale?.[12] ?? theme.palette.text.primary;

  const mutedColor = theme.grayScale?.[10] ?? theme.palette.text.secondary;

  const surface = theme.secondaryScale?.[3] ?? theme.palette.background.paper;

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        const progress =
          scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

        setScrollProgress(Math.min(100, Math.max(0, progress)));
        setScrolled(window.scrollY > 20);

        ticking = false;
      });
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('');

  const [themeMenuAnchor, setThemeMenuAnchor] =
    React.useState<HTMLElement | null>(null);

  const { themeSet, setThemeSet } = useThemeContext();

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openThemeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const closeThemeMenu = () => {
    setThemeMenuAnchor(null);
  };

  const selectTheme = (key: ThemeKey) => {
    setThemeSet(key);
    closeThemeMenu();
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  /*
   * Active section detection.
   *
   * Supports Services, Security, Games, Team, About and FAQs.
   * GitHub is an external link and does not participate in
   * section tracking.
   */
  React.useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = navItems
      .map((item) => document.getElementById(item.section))
      .filter((section): section is HTMLElement => section !== null);

    const updateFromHash = () => {
      const hash = window.location.hash.replace('#', '');

      if (navItems.some((item) => item.section === hash)) {
        setActiveSection(hash);
      } else if (!hash) {
        setActiveSection('');
      }
    };

    updateFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));

    window.addEventListener('hashchange', updateFromHash);
    window.addEventListener('popstate', updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', updateFromHash);
      window.removeEventListener('popstate', updateFromHash);
    };
  }, [pathname]);

  const isActive = (section: string) => {
    return pathname === '/' && activeSection === section;
  };

  /*
   * Smooth navigation for same-page section links.
   *
   * Native navigation is preserved when:
   * - The target page is different.
   * - The target section does not exist.
   * - The link is not a same-page hash link.
   */
  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    closeMobileMenu();

    const [path, hash] = href.split('#');

    if (!hash || path !== '/' || pathname !== '/') {
      return;
    }

    const target = document.getElementById(hash);

    if (!target) {
      return;
    }

    event.preventDefault();

    window.history.pushState(null, '', `/#${hash}`);

    setActiveSection(
      navItems.some((item) => item.section === hash) ? hash : ''
    );

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleThemeToggle = () => {
    closeMobileMenu();
    onToggleTheme();
  };

  /*
   * Shared gradient used by the logo and CTA buttons.
   */
  const gradient = `linear-gradient(135deg, ${primary}, ${secondary})`;

  /*
   * Desktop navigation styling.
   */
  const navButtonSx = (active: boolean) => ({
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',

    minHeight: 42,
    px: { lg: 1.1, xl: 1.4 },

    borderRadius: 1.5,

    color: active ? headingColor : mutedColor,

    fontSize: '0.82rem',
    fontWeight: active ? 800 : 650,

    textTransform: 'none',
    whiteSpace: 'nowrap',

    transition:
      'color 180ms ease, background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',

    // '&::before': {
    //   content: '""',
    //   position: 'absolute',
    //   inset: 0,
    //   zIndex: -1,

    //   borderRadius: 'inherit',

    //   opacity: active ? 1 : 0,
    //   transform: active ? 'scale(1)' : 'scale(0.92)',

    //   backgroundColor: alpha(primary, 0.06),

    //   transition: 'opacity 180ms ease, transform 180ms ease'
    // },

    '&::after': {
      content: '""',
      position: 'absolute',

      left: '50%',
      bottom: 3,

      width: active ? '100%' : 0,
      height: 2,

      borderRadius: 999,
      background: gradient,

      transform: 'translateX(-50%)',
      transition: 'width 220ms ease'
    },

    '& .MuiButton-startIcon': {
      position: 'relative',
      zIndex: 1,

      mr: 0.65,

      color: active ? primary : mutedColor,

      transition: 'color 180ms ease, transform 180ms ease'
    },

    '&:hover': {
      color: headingColor,
      backgroundColor: alpha(primary, 0.07),

      transform: 'translateY(-1px)',

      boxShadow: `inset 0 0 0 1px ${alpha(primary, 0.06)}`,

      '&::before': {
        opacity: 1,
        transform: 'scale(1)'
      },

      '&::after': {
        width: '55%'
      },

      '& .MuiButton-startIcon': {
        color: primary,
        transform: 'translateY(-1px) scale(1.08)'
      }
    },

    '&:active': {
      transform: 'scale(0.98)'
    }
  });

  /*
   * Primary CTA styling.
   */
  const projectButtonSx = {
    minHeight: 42,
    px: 1.75,

    borderRadius: 1.5,
    gap: 0.5,

    color: '#ffffff',
    background: gradient,

    fontSize: '0.84rem',
    fontWeight: 800,

    textTransform: 'none',
    whiteSpace: 'nowrap',

    border: `1px solid ${alpha(primary, 0.25)}`,

    boxShadow: `0 5px 18px ${alpha(primary, 0.2)}`,

    transition:
      'background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',

    '&:hover': {
      background: `linear-gradient(135deg, ${secondary}, ${primary})`,

      boxShadow: `0 8px 24px ${alpha(primary, 0.28)}`,

      transform: 'translateY(-1px)'
    },

    '&:active': {
      transform: 'translateY(0) scale(0.98)'
    }
  };

  /*
   * Shared icon button styling.
   */
  const iconButtonSx = {
    position: 'relative',

    width: 42,
    height: 42,

    flexShrink: 0,
    overflow: 'hidden',

    borderRadius: 1.5,

    color: isDark ? primary : secondary,

    background: `linear-gradient(
      135deg,
      ${alpha(primary, 0.14)},
      ${alpha(secondary, 0.1)}
    )`,

    border: `1px solid ${alpha(primary, 0.2)}`,

    transition:
      'color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',

    '&:hover': {
      color: primary,
      backgroundColor: alpha(primary, 0.12),
      borderColor: alpha(primary, 0.45),

      transform: 'translateY(-1px)',

      boxShadow: `0 0 18px ${alpha(primary, 0.12)}`
    },

    '&:active': {
      transform: 'scale(0.96)'
    }
  };

  const ThemeIcon = isDark ? LightModeRoundedIcon : DarkModeRoundedIcon;

  /*
   * Reusable theme preset selector.
   */
  const themeMenu = (
    <Menu
      anchorEl={themeMenuAnchor}
      open={Boolean(themeMenuAnchor)}
      onClose={closeThemeMenu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,

            minWidth: 240,
            maxHeight: 420,

            overflowY: 'auto',

            borderRadius: 2.5,

            border: `1px solid ${alpha(primary, 0.2)}`,

            backgroundColor: surface,
            backgroundImage: 'none',

            color: headingColor,

            boxShadow: `0 12px 36px ${alpha(
              theme.palette.common.black,
              isDark ? 0.25 : 0.1
            )}`
          }
        }
      }}
    >
      <Box sx={{ px: 2, py: 1.25 }}>
        <Typography
          sx={{
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.12em',

            color: mutedColor,
            textTransform: 'uppercase'
          }}
        >
          Choose your theme
        </Typography>
      </Box>

      <Divider sx={{ borderColor: alpha(primary, 0.12) }} />

      {(
        Object.entries(THEME_SETS) as [
          ThemeKey,
          (typeof THEME_SETS)[ThemeKey]
        ][]
      )
        .filter(([key]) => key !== 'custom')
        .map(([key, preset]) => {
          const selected = themeSet === key;

          return (
            <MenuItem
              key={key}
              selected={selected}
              onClick={() => selectTheme(key)}
              sx={{
                py: 1.25,
                px: 1.75,
                gap: 1,

                '&.Mui-selected': {
                  backgroundColor: alpha(primary, 0.12)
                },

                '&.Mui-selected:hover': {
                  backgroundColor: alpha(primary, 0.18)
                },

                '&:hover': {
                  backgroundColor: alpha(primary, 0.08)
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 30,
                  color: selected ? primary : mutedColor
                }}
              >
                {selected ? (
                  <CheckRoundedIcon fontSize="small" />
                ) : (
                  <PaletteRoundedIcon fontSize="small" />
                )}
              </ListItemIcon>

              <ListItemText primary={preset.label} />
            </MenuItem>
          );
        })}
    </Menu>
  );

  /*
   * Brand component shared by desktop and mobile navigation.
   */
  const brand = (
    <Box
      component="a"
      href="/"
      aria-label="Cryptech Services home"
      onClick={closeMobileMenu}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,

        minWidth: 0,
        flexShrink: 0,

        color: 'inherit',
        textDecoration: 'none'
      }}
    >
      <Box
        sx={{
          position: 'relative',

          display: 'grid',
          placeItems: 'center',

          width: { xs: 40, md: 44 },
          height: { xs: 40, md: 44 },

          borderRadius: 2,

          color: primary,

          background: `linear-gradient(
            145deg,
            ${alpha(primary, 0.16)},
            ${alpha(secondary, 0.08)}
          )`,

          border: `1px solid ${alpha(primary, 0.22)}`,

          flexShrink: 0,

          transition: 'transform 180ms ease, box-shadow 180ms ease',

          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -4,

            borderRadius: 2.5,

            border: `1px solid ${alpha(primary, 0.08)}`,

            pointerEvents: 'none'
          },

          '& .MuiSvgIcon-root': {
            fontSize: { xs: 23, md: 27 }
          },

          'a:hover &': {
            transform: 'translateY(-1px)',
            boxShadow: `0 5px 16px ${alpha(primary, 0.12)}`
          }
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.55rem', md: '1.8rem' },
            fontWeight: 900,
            lineHeight: 1
          }}
        >
          ❖
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: headingColor,

            fontSize: {
              xs: '0.9rem',
              sm: '0.95rem',
              md: '1.02rem'
            },

            fontWeight: 850,
            letterSpacing: '-0.035em',
            lineHeight: 1.2,

            whiteSpace: 'nowrap'
          }}
        >
          Cryptech Services
        </Typography>

        <Typography
          sx={{
            mt: 0.45,

            color: mutedColor,

            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            lineHeight: 1,

            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          Digital Solutions
        </Typography>
      </Box>
    </Box>
  );

  /*
   * Navigation item renderer.
   */
  const renderNavItems = (mobile = false) =>
    navItems.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.section);

      return (
        <Button
          key={item.section}
          component="a"
          href={item.href}
          onClick={(event) => handleNavigation(event, item.href)}
          startIcon={<Icon />}
          aria-current={active ? 'location' : undefined}
          sx={
            mobile
              ? {
                  position: 'relative',
                  isolation: 'isolate',
                  overflow: 'hidden',

                  justifyContent: 'flex-start',

                  width: '100%',
                  minHeight: 50,
                  px: 1.5,

                  borderRadius: 1.5,

                  color: active ? headingColor : mutedColor,

                  fontSize: '0.9rem',
                  fontWeight: active ? 800 : 650,

                  textTransform: 'none',

                  background: active
                    ? `linear-gradient(
                        135deg,
                        ${alpha(primary, 0.16)},
                        ${alpha(secondary, 0.12)}
                      )`
                    : 'transparent',

                  border: '1px solid',
                  borderColor: active ? alpha(primary, 0.2) : 'transparent',

                  boxShadow: active
                    ? `inset 0 0 0 1px ${alpha(primary, 0.04)}`
                    : 'none',

                  transition:
                    'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',

                  '&::before': {
                    content: '""',

                    position: 'absolute',
                    left: 0,
                    top: 7,
                    bottom: 7,

                    width: 3,

                    borderRadius: '0 4px 4px 0',
                    background: `linear-gradient(to bottom, ${primary}, ${secondary})`,

                    opacity: active ? 1 : 0,

                    transition: 'opacity 180ms ease'
                  },

                  '& .MuiButton-startIcon': {
                    position: 'relative',
                    zIndex: 1,

                    mr: 1.25,

                    color: active ? primary : mutedColor,

                    transition: 'color 180ms ease, transform 180ms ease'
                  },

                  '&:hover': {
                    color: headingColor,

                    background: `linear-gradient(
                      135deg,
                      ${alpha(primary, 0.1)},
                      ${alpha(secondary, 0.06)}
                    )`,

                    borderColor: alpha(primary, 0.17),
                    transform: 'translateX(2px)',

                    '& .MuiButton-startIcon': {
                      color: primary,
                      transform: 'scale(1.08)'
                    }
                  },

                  '&:active': {
                    transform: 'scale(0.99)'
                  }
                }
              : navButtonSx(active)
          }
        >
          {item.label}
        </Button>
      );
    });

  /*
   * GitHub link renderer.
   */

  return (
    <>
      {/* Page scroll progress indicator */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 3,
          zIndex: theme.zIndex.appBar + 2,
          pointerEvents: 'none',
          bgcolor: alpha(primary, 0.08)
        }}
      >
        <Box
          sx={{
            width: `${scrollProgress}%`,
            height: '100%',
            background: gradient,
            boxShadow: `0 0 10px ${alpha(primary, 0.35)}`,
            transition: 'width 80ms linear'
          }}
        />
      </Box>

      <AppBar
        elevation={0}
        color="transparent"
        sx={{
          position: {
            xs: 'relative',
            sm: 'sticky'
          },
          top: 0,
          px: { xs: 1.5, sm: 2.5, md: 3 },

          zIndex: theme.zIndex.appBar,

          color: headingColor,

          backgroundImage: 'none',

          backgroundColor: scrolled
            ? alpha(surface, isDark ? 1 : 1)
            : 'transparent',

          backdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'none',

          borderBottom: scrolled
            ? `1px solid ${alpha(primary, isDark ? 0.2 : 0.12)}`
            : '1px solid transparent',

          boxShadow: scrolled
            ? `0 8px 30px ${alpha(
                theme.palette.common.black,
                isDark ? 0.16 : 0.045
              )}`
            : 'none',

          transition: [
            'background-color 220ms ease',
            'backdrop-filter 220ms ease',
            'border-color 220ms ease',
            'box-shadow 220ms ease'
          ].join(', ')
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 68, md: 78 },

            gap: { xs: 1, md: 1.5 },

            justifyContent: 'space-between'
          }}
        >
          {/* BRAND */}

          {brand}

          {/* DESKTOP NAVIGATION */}

          {!isMobile && (
            <Stack
              component="nav"
              aria-label="Main navigation"
              direction="row"
              spacing={{ lg: 0.15, xl: 4 }}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0,
                flex: 1,
                px: { lg: 0.5, xl: 1 }
              }}
            >
              {renderNavItems()}
            </Stack>
          )}

          {/* DESKTOP AND MOBILE ACTIONS */}

          <Stack
            direction="row"
            spacing={{ xs: 0.75, md: 1 }}
            sx={{
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <Tooltip
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <IconButton
                onClick={handleThemeToggle}
                aria-label={
                  isDark ? 'Switch to light mode' : 'Switch to dark mode'
                }
                sx={iconButtonSx}
              >
                <ThemeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* DESKTOP THEME SELECTOR */}

            {!isMobile && (
              <Tooltip title="Select Theme">
                <Button
                  onClick={openThemeMenu}
                  startIcon={<PaletteRoundedIcon />}
                  sx={{
                    minHeight: 42,
                    px: { lg: 1, xl: 1.5 },

                    borderRadius: 1.5,

                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',

                    color: headingColor,

                    border: `1px solid ${alpha(primary, 0.25)}`,
                    backgroundColor: alpha(primary, 0.06),

                    transition: 'all 180ms ease',

                    '& .MuiButton-startIcon': {
                      color: primary,
                      mr: 0.6
                    },

                    '&:hover': {
                      backgroundColor: alpha(primary, 0.12),
                      borderColor: alpha(primary, 0.4),
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Theme
                </Button>
              </Tooltip>
            )}

            {!isMobile && (
              <Button
                component="a"
                href="/#contact-form"
                onClick={(event) => handleNavigation(event, '/#contact-form')}
                variant="contained"
                startIcon={<MailOutlineRoundedIcon />}
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={projectButtonSx}
              >
                Start a Project
              </Button>
            )}

            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                sx={iconButtonSx}
              >
                <MenuRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* THEME PRESET MENU */}

      {themeMenu}

      {/* MOBILE DRAWER */}

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileMenu}
        slotProps={{
          paper: {
            sx: {
              width: 'min(88vw, 380px)',

              color: headingColor,

              backgroundColor: surface,
              backgroundImage: 'none',

              borderLeft: `1px solid ${alpha(primary, 0.2)}`,

              boxShadow: `-12px 0 40px ${alpha(
                theme.palette.common.black,
                0.2
              )}`
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            p: 2.5
          }}
        >
          {/* DRAWER HEADER */}

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 2
            }}
          >
            {brand}

            <IconButton
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
              sx={iconButtonSx}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider sx={{ borderColor: alpha(primary, 0.15) }} />

          {/* MOBILE NAVIGATION */}

          <Typography
            sx={{
              mt: 3,
              mb: 1.25,
              px: 0.75,

              color: mutedColor,

              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            Explore Cryptech
          </Typography>

          <Stack component="nav" aria-label="Mobile navigation" spacing={0.75}>
            {renderNavItems(true)}
          </Stack>

          <Divider
            sx={{
              my: 2,
              borderColor: alpha(primary, 0.15)
            }}
          />

          {/* MOBILE DARK/LIGHT TOGGLE */}

          <Button
            onClick={handleThemeToggle}
            startIcon={<ThemeIcon />}
            sx={{
              justifyContent: 'flex-start',

              minHeight: 48,
              px: 1.5,

              borderRadius: 1.5,

              color: headingColor,

              fontWeight: 700,
              textTransform: 'none',

              background: `linear-gradient(
                135deg,
                ${alpha(primary, 0.1)},
                ${alpha(secondary, 0.06)}
              )`,

              border: `1px solid ${alpha(primary, 0.17)}`,

              '& .MuiButton-startIcon': {
                color: primary
              },

              '&:hover': {
                backgroundColor: alpha(primary, 0.12),
                borderColor: alpha(primary, 0.35)
              }
            }}
          >
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Button>

          {/* MOBILE THEME SELECTOR */}

          <Button
            onClick={(event) => {
              closeMobileMenu();
              openThemeMenu(event);
            }}
            startIcon={<PaletteRoundedIcon />}
            endIcon={<ArrowOutwardRoundedIcon />}
            fullWidth
            sx={{
              justifyContent: 'flex-start',

              minHeight: 48,
              mt: 1,

              px: 1.5,

              borderRadius: 1.5,

              color: headingColor,

              fontWeight: 700,
              textTransform: 'none',

              background: `linear-gradient(
                135deg,
                ${alpha(primary, 0.1)},
                ${alpha(secondary, 0.06)}
              )`,

              border: `1px solid ${alpha(primary, 0.17)}`,

              '& .MuiButton-startIcon': {
                color: primary
              },

              '& .MuiButton-endIcon': {
                ml: 'auto',
                color: mutedColor
              },

              '&:hover': {
                backgroundColor: alpha(primary, 0.12),
                borderColor: alpha(primary, 0.35)
              }
            }}
          >
            Select Theme
          </Button>

          <Box sx={{ flex: 1, minHeight: 32 }} />

          {/* MOBILE CONTACT CARD */}

          <Box
            sx={{
              p: 2,

              borderRadius: 2.5,

              border: `1px solid ${alpha(primary, 0.18)}`,

              background: `linear-gradient(
                145deg,
                ${alpha(primary, isDark ? 0.12 : 0.08)},
                ${alpha(secondary, 0.04)}
              )`
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                mb: 1
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',

                  width: 34,
                  height: 34,

                  flexShrink: 0,

                  borderRadius: 1.5,

                  color: primary,

                  backgroundColor: alpha(primary, 0.12),

                  border: `1px solid ${alpha(primary, 0.18)}`
                }}
              >
                <MailOutlineRoundedIcon fontSize="small" />
              </Box>

              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em'
                }}
              >
                Have a project in mind?
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 0.75,
                mb: 2,

                color: mutedColor,

                fontSize: '0.82rem',
                lineHeight: 1.8
              }}
            >
              Let&apos;s discuss your goals and build something great.
            </Typography>

            <Button
              component="a"
              href="/#contact-form"
              onClick={(event) => handleNavigation(event, '/#contact-form')}
              fullWidth
              variant="contained"
              startIcon={<MailOutlineRoundedIcon />}
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={projectButtonSx}
            >
              Start a Project
            </Button>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                mt: 1.75
              }}
            >
              <Typography
                sx={{
                  color: mutedColor,
                  fontSize: '0.72rem'
                }}
              >
                Let&apos;s build something great.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
