'use client';

import { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Pagination,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

import { alpha } from '@mui/material/styles';

import { useMediaQuery } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

import {
  fetchTeamMembers,
  type TeamMember,
  type TeamCategory
} from '@/lib/fectTeamMembers';

type TeamProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  email?: string;
  members?: TeamMember[];
};

/**
 * Optional extended profile fields.
 *
 * These fields are compatible with the existing TeamMember type.
 * They will display when they are returned by Supabase.
 */
type ExtendedTeamMember = TeamMember & {
  bio?: string | null;
  expertise?: string[] | null;
  achievements?: string[] | null;
  projects?: string[] | null;
  location?: string | null;
  availability?: string | null;
  website?: string | null;
  twitter?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                               Member Avatar                                */
/* -------------------------------------------------------------------------- */

function MemberAvatar({ member }: { member: TeamMember }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const avatarUrl =
    member.discordId && member.discordAvatar
      ? `https://cdn.discordapp.com/avatars/${member.discordId}/${member.discordAvatar}.${member.discordAvatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : member.image;

  return (
    <Box
      sx={{
        position: 'relative',
        height: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 2,
        background: `
          radial-gradient(
            circle at 50% 100%,
            ${alpha(member.accent, isDark ? 0.2 : 0.12)},
            transparent 65%
          ),
          ${alpha(theme.palette.primary.main, isDark ? 0.045 : 0.025)}
        `,
        border: `1px solid ${alpha(member.accent, 0.16)}`
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.45,
          backgroundImage: `
            linear-gradient(${alpha(member.accent, 0.07)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(member.accent, 0.07)} 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 35%, black 75%, transparent)'
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          width: 116,
          height: 116,
          borderRadius: '50%',
          border: `1px solid ${alpha(member.accent, 0.25)}`
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          width: 96,
          height: 96,
          borderRadius: '50%',
          border: `1px dashed ${alpha(member.accent, 0.25)}`
        }}
      />

      {[0, 1, 2, 3, 4, 5].map((node) => (
        <Box
          key={node}
          sx={{
            position: 'absolute',
            zIndex: 1,
            width: node % 2 === 0 ? 5 : 3,
            height: node % 2 === 0 ? 5 : 3,
            borderRadius: '50%',
            backgroundColor: member.accent,
            opacity: 0.8,
            left: `${12 + ((node * 17) % 78)}%`,
            top: `${15 + ((node * 23) % 65)}%`,
            boxShadow: `0 0 12px ${alpha(member.accent, 0.7)}`,
            pointerEvents: 'none'
          }}
        />
      ))}

      <Avatar
        src={
          member.discordId && member.discordAvatar
            ? `https://cdn.discordapp.com/avatars/${member.discordId}/${member.discordAvatar}.${member.discordAvatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
            : member.image
        }
        alt={member.name}
        slotProps={{
          img: {
            loading: 'lazy'
          }
        }}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 80,
          height: 80,
          bgcolor: alpha(member.accent, 0.15),
          color: member.accent,
          fontSize: '1.4rem',
          fontWeight: 800,
          border: `2px solid ${alpha(member.accent, 0.65)}`,
          boxShadow: `0 0 32px ${alpha(member.accent, 0.18)}`,
          transition: 'transform 220ms ease, box-shadow 220ms ease',
          '& img': {
            objectFit: 'cover'
          },
          '.team-card:hover &': {
            transform: 'scale(1.06)',
            boxShadow: `0 0 42px ${alpha(member.accent, 0.3)}`
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none'
          }
        }}
      >
        {member.initials}
      </Avatar>

      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
          left: 12,
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: member.accent
          }}
        />

        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: 'text.secondary'
          }}
        >
          CRYPTECH SERVICES
        </Typography>
      </Stack>

      <Box
        sx={{
          position: 'absolute',
          right: 10,
          bottom: 9,
          width: 25,
          height: 25,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          color: member.accent,
          fontSize: '0.65rem',
          fontWeight: 800
        }}
      >
        {member.initials.slice(0, 1)}
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Team Member Details Modal                         */
/* -------------------------------------------------------------------------- */

function TeamMemberModal({
  member,
  open,
  onClose
}: {
  member: ExtendedTeamMember | null;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();

  if (!member) return null;

  const accent = member.accent;
  const expertise = member.expertise?.length
    ? member.expertise
    : (member.skills ?? []);

  const achievements = member.achievements ?? [];
  const projects = member.projects ?? [];

  const avatarUrl =
    member.discordId && member.discordAvatar
      ? `https://cdn.discordapp.com/avatars/${member.discordId}/${member.discordAvatar}.${member.discordAvatar.startsWith('a_') ? 'gif' : 'png'}?size=512`
      : member.image;

  const panelBorder = alpha(accent, 0.22);
  const subtleBackground = alpha(accent, 0.055);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const socialLinks = [
    { label: 'GitHub', href: member.github, icon: <GitHubIcon /> },
    { label: 'LinkedIn', href: member.linkedin, icon: <LinkedInIcon /> },
    {
      label: 'Website',
      href: member.website,
      icon: <LanguageRoundedIcon />
    },
    {
      label: 'X / Twitter',
      href: member.twitter,
      icon: <ArrowOutwardRoundedIcon />
    }
  ].filter(
    (link): link is typeof link & { href: string } =>
      typeof link.href === 'string' && link.href.trim().length > 0
  );

  const sections = [
    {
      id: '01',
      title: 'Expertise',
      subtitle: 'Skills and specializations',
      icon: <WorkspacePremiumRoundedIcon />,
      items: expertise
    },
    {
      id: '02',
      title: 'Achievements',
      subtitle: 'Milestones and accomplishments',
      icon: <EmojiEventsRoundedIcon />,
      items: achievements
    },
    {
      id: '03',
      title: 'Projects',
      subtitle: 'Work and contributions',
      icon: <FolderOpenRoundedIcon />,
      items: projects
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="md"
      aria-labelledby="team-member-dialog-title"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 0, sm: 3.5 },
            border: isMobile ? 'none' : `1px solid ${panelBorder}`,
            bgcolor: theme.secondaryScale?.[4],
            backgroundImage: 'none',
            boxShadow: isMobile
              ? 'none'
              : `0 30px 100px ${alpha('#000000', 0.3)}`,
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : 'calc(100% - 64px)'
          }
        }
      }}
    >
      {/* Unified Team Member Profile Header */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          borderBottom: `1px solid ${panelBorder}`,
          background: `
      radial-gradient(
        ellipse at 8% 100%,
        ${alpha(accent, 0.2)} 0%,
        transparent 45%
      ),
      radial-gradient(
        ellipse at 100% 0%,
        ${alpha(accent, 0.16)} 0%,
        transparent 42%
      ),
      radial-gradient(
        ellipse at 55% 55%,
        ${alpha(theme.palette.primary.main, 0.08)} 0%,
        transparent 60%
      ),
      linear-gradient(
        135deg,
        ${theme.palette.background.paper} 0%,
        ${alpha(accent, 0.045)} 50%,
        ${theme.palette.background.paper} 100%
      )
    `
        }}
      >
        {/* Background grid */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            opacity: 0.16,
            backgroundImage: `
        linear-gradient(${alpha(accent, 0.28)} 1px, transparent 1px),
        linear-gradient(90deg, ${alpha(accent, 0.28)} 1px, transparent 1px)
      `,
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, black, transparent 90%)',
            pointerEvents: 'none'
          }}
        />

        {/* Ambient glow */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: { xs: 240, sm: 380 },
            height: { xs: 240, sm: 380 },
            top: { xs: -135, sm: -210 },
            right: { xs: -110, sm: 0 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(accent, 0.25)} 0%, ${alpha(accent, 0.07)} 40%, transparent 70%)`,
            filter: 'blur(10px)',
            pointerEvents: 'none'
          }}
        />

        {/* Decorative orbit */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: { xs: 190, sm: 300 },
            height: { xs: 190, sm: 300 },
            top: { xs: -95, sm: -175 },
            right: { xs: -65, sm: 45 },
            borderRadius: '50%',
            border: `1px solid ${alpha(accent, 0.22)}`,
            pointerEvents: 'none'
          }}
        />

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: { xs: 130, sm: 215 },
            height: { xs: 130, sm: 215 },
            top: { xs: -65, sm: -132 },
            right: { xs: -35, sm: 88 },
            borderRadius: '50%',
            border: `1px dashed ${alpha(accent, 0.3)}`,
            pointerEvents: 'none'
          }}
        />

        {/* Header content */}
        <Box
          sx={{
            position: 'relative',
            px: { xs: 2.5, sm: 4 },
            pt: { xs: 2.5, sm: 3.5 },
            pb: { xs: 2.5, sm: 3 }
          }}
        >
          {/* Brand and close button */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              mb: { xs: 3.5, sm: 4.5 }
            }}
          >
            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', mb: 1.75 }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: accent,
                    boxShadow: `0 0 12px ${alpha(accent, 0.75)}`
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.66rem',
                    fontWeight: 850,
                    letterSpacing: '0.15em',
                    color: accent,
                    textTransform: 'uppercase'
                  }}
                >
                  CRYPTECH / PERSONNEL
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.4rem' },
                  fontWeight: 950,
                  lineHeight: 1,
                  letterSpacing: '-0.065em'
                }}
              >
                Behind the{' '}
                <Box
                  component="span"
                  sx={{
                    color: accent,
                    textShadow: `0 0 25px ${alpha(accent, 0.22)}`
                  }}
                >
                  expertise.
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 1.25,
                  color: 'text.secondary',
                  fontSize: { xs: '0.72rem', sm: '0.8rem' },
                  letterSpacing: '0.02em'
                }}
              >
                People building digital possibilities.
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              aria-label="Close member details"
              sx={{
                flexShrink: 0,
                color: 'text.primary',
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                border: `1px solid ${panelBorder}`,
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                '&:hover': {
                  color: accent,
                  bgcolor: theme.palette.background.paper,
                  borderColor: accent
                }
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          {/* Member identity */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2.5, sm: 3.5 }}
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}
          >
            {/* Portrait */}
            <Box
              sx={{
                position: 'relative',
                flexShrink: 0,
                p: 0.75,
                borderRadius: 3,
                background: `
            linear-gradient(
              145deg,
              ${alpha(accent, 0.85)},
              ${alpha(accent, 0.08)} 48%,
              ${alpha(accent, 0.55)}
            )
          `,
                boxShadow: `0 12px 36px ${alpha(accent, 0.16)}`
              }}
            >
              <Avatar
                src={avatarUrl}
                alt={member.name}
                slotProps={{
                  img: { loading: 'lazy' }
                }}
                sx={{
                  width: { xs: 104, sm: 132 },
                  height: { xs: 104, sm: 132 },
                  borderRadius: 2.25,
                  bgcolor: alpha(accent, 0.14),
                  color: accent,
                  fontSize: '2rem',
                  fontWeight: 900,
                  border: `2px solid ${theme.palette.background.paper}`
                }}
              >
                {member.initials}
              </Avatar>

              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  right: -4,
                  bottom: -4,
                  width: 24,
                  height: 24,
                  borderRadius: 1.25,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${panelBorder}`,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '2px',
                    bgcolor: accent,
                    transform: 'rotate(45deg)'
                  }}
                />
              </Box>
            </Box>

            {/* Member information */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                useFlexGap
                sx={{
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1.5
                }}
              >
                <Chip
                  label={member.category}
                  size="small"
                  sx={{
                    bgcolor: alpha(accent, 0.1),
                    color: accent,
                    border: `1px solid ${panelBorder}`,
                    borderRadius: 1.25,
                    fontWeight: 850,
                    fontSize: '0.68rem'
                  }}
                />

                {member.availability && (
                  <Chip
                    label={member.availability}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.divider,
                      color: 'text.secondary',
                      borderRadius: 1.25,
                      fontWeight: 650,
                      fontSize: '0.68rem'
                    }}
                  />
                )}
              </Stack>

              <Typography
                id="team-member-dialog-title"
                sx={{
                  fontSize: { xs: '2.2rem', sm: '3rem' },
                  fontWeight: 950,
                  lineHeight: 1,
                  letterSpacing: '-0.065em',
                  overflowWrap: 'anywhere'
                }}
              >
                {member.name}
                <Box
                  component="span"
                  sx={{
                    color: accent,
                    textShadow: `0 0 24px ${alpha(accent, 0.2)}`
                  }}
                >
                  .
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 1.25,
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                  color: accent,
                  fontWeight: 800,
                  letterSpacing: '-0.015em'
                }}
              >
                {member.role}
              </Typography>

              {member.location && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    alignItems: 'center',
                    mt: 1.5,
                    color: 'text.secondary'
                  }}
                >
                  <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
                  <Typography variant="body2">{member.location}</Typography>
                </Stack>
              )}
            </Box>
          </Stack>

          {/* Profile footer */}
          <Divider
            sx={{
              my: { xs: 2.5, sm: 3 },
              borderColor: alpha(accent, 0.18)
            }}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              rowGap: 1
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.1em'
              }}
            >
              DIGITAL SOLUTIONS · PEOPLE BEHIND THE WORK
            </Typography>

            <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
              {[0, 1, 2].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: dot === 0 ? 18 : 5,
                    height: 5,
                    borderRadius: 5,
                    bgcolor: dot === 0 ? accent : alpha(accent, 0.3)
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Bottom accent line */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '65%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.75)}, transparent)`,
            boxShadow: `0 0 14px ${alpha(accent, 0.35)}`,
            pointerEvents: 'none'
          }}
        />
      </Box>

      {/* Main content */}
      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          '&:first-of-type': { pt: { xs: 2.5, sm: 3.5 } }
        }}
      >
        {/* Overview */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', mb: 1.75 }}
          >
            <Typography
              sx={{
                color: accent,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                fontWeight: 900
              }}
            >
              01
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 850,
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              Overview
            </Typography>

            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Stack>

          <Typography
            sx={{
              maxWidth: 720,
              color: 'text.secondary',
              fontSize: '0.94rem',
              lineHeight: 1.95,
              whiteSpace: 'pre-line',
              overflowWrap: 'anywhere'
            }}
          >
            {member.bio ||
              member.description ||
              'This team member has not added a profile description yet.'}
          </Typography>
        </Box>

        {/* Expertise, achievements and projects */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', mb: 2 }}
          >
            <Typography
              sx={{
                color: accent,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                fontWeight: 900
              }}
            >
              02
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 850,
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              Capabilities & Contributions
            </Typography>

            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))'
              },
              gap: 1.5
            }}
          >
            {sections.map((section, index) => (
              <Box
                key={section.id}
                sx={{
                  gridColumn:
                    index === 2 ? { xs: 'auto', sm: '1 / -1' } : 'auto',
                  minWidth: 0,
                  p: { xs: 2, sm: 2.25 },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.text.primary, 0.018),
                  transition:
                    'border-color 180ms ease, background-color 180ms ease',
                  '&:hover': {
                    borderColor: panelBorder,
                    bgcolor: alpha(accent, 0.035)
                  }
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', mb: 1.75 }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 34,
                      height: 34,
                      flexShrink: 0,
                      borderRadius: 1.5,
                      color: accent,
                      bgcolor: subtleBackground,
                      border: `1px solid ${panelBorder}`,
                      '& svg': { fontSize: 19 }
                    }}
                  >
                    {section.icon}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 850 }}>
                      {section.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {section.subtitle}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontFamily: 'monospace',
                      fontSize: '0.68rem'
                    }}
                  >
                    {String(section.items.length).padStart(2, '0')}
                  </Typography>
                </Stack>

                {section.items.length > 0 ? (
                  <Stack spacing={1}>
                    {section.items.map((item) => (
                      <Stack
                        key={`${section.id}-${item}`}
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center' }}
                      >
                        <Box
                          sx={{
                            mt: '8px',
                            width: 5,
                            height: 5,
                            flexShrink: 0,
                            borderRadius: '1px',
                            bgcolor: accent,
                            transform: 'rotate(45deg)'
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            minWidth: 0,
                            color: 'text.secondary',
                            lineHeight: 1.75,
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                  >
                    No {section.title.toLowerCase()} added yet.
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contact and social links */}
        <Box>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', mb: 2 }}
          >
            <Typography
              sx={{
                color: accent,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                fontWeight: 900
              }}
            >
              03
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 850,
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              Find & Connect
            </Typography>

            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Stack>

          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2.5,
              border: `1px solid ${panelBorder}`,
              background: `
                radial-gradient(
                  ellipse at 100% 0%,
                  ${alpha(accent, 0.13)},
                  transparent 58%
                ),
                linear-gradient(
                  135deg,
                  ${alpha(accent, 0.065)},
                  ${alpha(theme.palette.background.paper, 0.1)}
                )
              `
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900 }}>
                  Let&apos;s build something meaningful.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    color: 'text.secondary',
                    lineHeight: 1.7
                  }}
                >
                  Connect with {member.name} or explore their work online.
                </Typography>
              </Box>

              <Button
                component="a"
                href={`mailto:${member.email}`}
                variant="contained"
                startIcon={<EmailOutlinedIcon />}
                sx={{
                  flexShrink: 0,
                  bgcolor: accent,
                  color: theme.palette.getContrastText(accent),
                  fontWeight: 850,
                  borderRadius: 1.5,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: accent,
                    filter: 'brightness(0.92)',
                    boxShadow: 'none'
                  }
                }}
              >
                Contact
              </Button>
            </Stack>

            {socialLinks.length > 0 && (
              <>
                <Divider sx={{ my: 2, borderColor: panelBorder }} />

                <Stack
                  direction="row"
                  useFlexGap
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {socialLinks.map((link) => (
                    <Button
                      key={link.label}
                      component="a"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      variant="outlined"
                      startIcon={link.icon}
                      sx={{
                        minWidth: 0,
                        borderRadius: 1.5,
                        borderColor: theme.palette.divider,
                        color: 'text.primary',
                        fontWeight: 750,
                        '&:hover': {
                          borderColor: accent,
                          bgcolor: alpha(accent, 0.07)
                        }
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Stack>
              </>
            )}
          </Box>
        </Box>
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
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Team Member Card                              */
/* -------------------------------------------------------------------------- */

function TeamMemberCard({
  member,
  onClick
}: {
  member: TeamMember;
  onClick: () => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const cardSurface =
    theme.secondaryScale?.[4] ?? theme.palette.background.paper;

  return (
    <Box
      component="article"
      className="team-card"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${member.name}`}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 340,
        height: '100%',
        mx: 'auto',
        p: 1.5,
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: cardSurface,
        border: `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        transition:
          'transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease',

        '&:hover, &:focus-visible': {
          transform: 'translateY(-5px)',
          borderColor: alpha(member.accent, 0.6),
          boxShadow: `0 18px 40px ${alpha(member.accent, isDark ? 0.09 : 0.07)}`
        },

        '&:focus-visible': {
          outline: `2px solid ${member.accent}`,
          outlineOffset: 3
        },

        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': {
            transform: 'none'
          }
        }
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: 2,
          bgcolor: member.accent,
          opacity: 0.8,
          borderRadius: '0 0 4px 4px'
        }}
      />

      <MemberAvatar member={member} />

      <Box sx={{ px: 0.5, pt: 2, pb: 0.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 850,
                lineHeight: 1.3,
                letterSpacing: '-0.035em',
                overflowWrap: 'anywhere'
              }}
            >
              {member.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.65,
                color: member.accent,
                fontSize: '0.75rem',
                fontWeight: 750,
                lineHeight: 1.5
              }}
            >
              {member.role}
            </Typography>
          </Box>

          <Chip
            label={member.category}
            size="small"
            variant="outlined"
            sx={{
              flexShrink: 0,
              height: 23,
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: theme.palette.divider,
              fontSize: '0.62rem',
              fontWeight: 650,
              '& .MuiChip-label': {
                px: 0.9
              }
            }}
          />
        </Stack>

        <Typography
          sx={{
            mt: 1.5,
            minHeight: 67,
            color: 'text.secondary',
            fontSize: '0.79rem',
            lineHeight: 1.75,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {member.description}
        </Typography>

        <Stack
          direction="row"
          useFlexGap
          sx={{
            flexWrap: 'wrap',
            gap: 0.65,
            mt: 1.75,
            minHeight: 52,
            alignContent: 'flex-start'
          }}
        >
          {member.skills.slice(0, 3).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                height: 24,
                maxWidth: '100%',
                borderRadius: 1.25,
                bgcolor: alpha(member.accent, 0.08),
                color: 'text.secondary',
                border: `1px solid ${alpha(member.accent, 0.15)}`,
                fontSize: '0.65rem',
                '& .MuiChip-label': {
                  px: 0.9,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }}
            />
          ))}

          {member.skills.length > 3 && (
            <Chip
              label={`+${member.skills.length - 3}`}
              size="small"
              sx={{
                height: 24,
                borderRadius: 1.25,
                bgcolor: alpha(theme.palette.text.primary, 0.04),
                color: 'text.secondary',
                fontSize: '0.65rem'
              }}
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1.5,
          pt: 1.5,
          px: 0.5,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
        >
          <EmailOutlinedIcon
            sx={{
              flexShrink: 0,
              fontSize: 17,
              color: member.accent
            }}
          />

          <MuiLink
            href={`mailto:${member.email}`}
            underline="none"
            title={member.email}
            onClick={(event) => event.stopPropagation()}
            sx={{
              minWidth: 0,
              color: 'text.secondary',
              fontSize: '0.7rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'color 180ms ease',
              '&:hover': {
                color: member.accent
              }
            }}
          >
            {member.email}
          </MuiLink>
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          {member.github && (
            <MuiLink
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on GitHub`}
              onClick={(event) => event.stopPropagation()}
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 1.5,
                color: 'text.secondary',
                '&:hover': {
                  color: member.accent,
                  bgcolor: alpha(member.accent, 0.1)
                }
              }}
            >
              <GitHubIcon sx={{ fontSize: 18 }} />
            </MuiLink>
          )}

          {member.linkedin && (
            <MuiLink
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              onClick={(event) => event.stopPropagation()}
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 1.5,
                color: 'text.secondary',
                '&:hover': {
                  color: member.accent,
                  bgcolor: alpha(member.accent, 0.1)
                }
              }}
            >
              <LinkedInIcon sx={{ fontSize: 18 }} />
            </MuiLink>
          )}

          <MuiLink
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            onClick={(event) => event.stopPropagation()}
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 30,
              height: 30,
              borderRadius: 1.5,
              color: member.accent,
              bgcolor: alpha(member.accent, 0.09),
              '&:hover': {
                bgcolor: alpha(member.accent, 0.18)
              }
            }}
          >
            <ArrowOutwardRoundedIcon sx={{ fontSize: 17 }} />
          </MuiLink>
        </Stack>
      </Stack>

      <Typography
        sx={{
          mt: 1.25,
          textAlign: 'center',
          color: member.accent,
          fontSize: '0.68rem',
          fontWeight: 750
        }}
      >
        View full profile{' '}
        <ArrowOutwardRoundedIcon
          sx={{ fontSize: 12, verticalAlign: 'middle' }}
        />
      </Typography>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Team Section                                  */
/* -------------------------------------------------------------------------- */

export default function Team({
  eyebrow = 'THE PEOPLE BEHIND THE WORK',
  title = 'Meet the team.',
  description = 'Meet the people behind Cryptech Services, bringing together administration, creative expertise, development, and community support.',
  email: _email = 'inquiries@cryptech.services',
  members: suppliedMembers
}: TeamProps) {
  const theme = useTheme();

  const [fetchedMembers, setFetchedMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(!suppliedMembers);
  const [loadError, setLoadError] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    TeamCategory | 'All'
  >('All');

  const [page, setPage] = useState(1);

  // NEW: selected member controls the profile modal.
  const [selectedMember, setSelectedMember] =
    useState<ExtendedTeamMember | null>(null);

  const membersPerPage = 4;

  useEffect(() => {
    if (suppliedMembers !== undefined) {
      setFetchedMembers(suppliedMembers);
      setLoading(false);
      setLoadError(false);
      return;
    }

    let active = true;

    async function loadMembers() {
      try {
        setLoading(true);
        setLoadError(false);

        const result = await fetchTeamMembers();

        if (active) {
          setFetchedMembers(result);
        }
      } catch (error) {
        console.error('Failed to load team members:', error);

        if (active) {
          setLoadError(true);
          setFetchedMembers([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      active = false;
    };
  }, [suppliedMembers]);

  const members = suppliedMembers ?? fetchedMembers;

  const categories: (TeamCategory | 'All')[] = [
    'All',
    'Admins',
    'Team',
    'Moderators'
  ];

  const filteredMembers =
    selectedCategory === 'All'
      ? members
      : members.filter((member) => member.category === selectedCategory);

  const pageCount = Math.ceil(filteredMembers.length / membersPerPage);

  const visibleMembers = filteredMembers.slice(
    (page - 1) * membersPerPage,
    page * membersPerPage
  );

  const surface =
    theme.backgroundScale?.[3] ?? theme.palette.background.default;

  const categoryCount = (category: TeamCategory | 'All') =>
    category === 'All'
      ? members.length
      : members.filter((member) => member.category === category).length;

  return (
    <Box
      component="section"
      id="team"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        py: { xs: 8, md: 12 },
        backgroundColor: surface,
        scrollMarginTop: '90px',
        borderTop: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
        borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -180,
          left: '-12%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.1
          )}, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      {/* Animated SVG network background */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.2,
          isolation: 'isolate',

          '& .team-grid': {
            animation: 'teamGridDrift 35s linear infinite'
          },
          '& .team-glow': {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: 'teamGlowPulse 9s ease-in-out infinite alternate'
          },
          '& .team-glow-right': {
            animationDelay: '-4s'
          },
          '& .team-circuit': {
            strokeDasharray: '8 12',
            animation: 'teamCircuitFlow 18s linear infinite'
          },
          '& .team-circuit-reverse': {
            strokeDasharray: '5 14',
            animation: 'teamCircuitReverse 22s linear infinite'
          },
          '& .team-data-line': {
            strokeDasharray: '2 26',
            animation: 'teamDataFlow 7s linear infinite'
          },
          '& .team-data-line-delayed': {
            animationDelay: '-3.5s'
          },
          '& .team-node': {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: 'teamNodePulse 3.8s ease-in-out infinite'
          },
          '& .team-node:nth-of-type(3n)': {
            animationDelay: '-1.3s'
          },
          '& .team-node:nth-of-type(4n)': {
            animationDelay: '-2.4s'
          },
          '& .team-orbit': {
            transformBox: 'view-box',
            transformOrigin: '720px 350px',
            animation: 'teamOrbitRotate 65s linear infinite'
          },
          '& .team-orbit-reverse': {
            transformBox: 'view-box',
            transformOrigin: '720px 350px',
            animation: 'teamOrbitRotateReverse 85s linear infinite'
          },
          '& .team-orbit-dot': {
            animation: 'teamNodePulse 2.6s ease-in-out infinite'
          },
          '@keyframes teamGridDrift': {
            from: { transform: 'translate(0, 0)' },
            to: { transform: 'translate(48px, 48px)' }
          },
          '@keyframes teamGlowPulse': {
            '0%': { opacity: 0.45, transform: 'scale(0.9)' },
            '100%': { opacity: 1, transform: 'scale(1.12)' }
          },
          '@keyframes teamCircuitFlow': {
            from: { strokeDashoffset: 0 },
            to: { strokeDashoffset: -200 }
          },
          '@keyframes teamCircuitReverse': {
            from: { strokeDashoffset: 0 },
            to: { strokeDashoffset: 200 }
          },
          '@keyframes teamDataFlow': {
            from: { strokeDashoffset: 0 },
            to: { strokeDashoffset: -112 }
          },
          '@keyframes teamNodePulse': {
            '0%, 100%': { opacity: 0.35, transform: 'scale(0.8)' },
            '50%': { opacity: 1, transform: 'scale(1.4)' }
          },
          '@keyframes teamOrbitRotate': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' }
          },
          '@keyframes teamOrbitRotateReverse': {
            from: { transform: 'rotate(360deg)' },
            to: { transform: 'rotate(0deg)' }
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& .team-grid, & .team-glow, & .team-circuit, & .team-circuit-reverse, & .team-data-line, & .team-node, & .team-orbit, & .team-orbit-reverse, & .team-orbit-dot':
              {
                animation: 'none !important'
              }
          }
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMid slice"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            color: 'primary.main',
            overflow: 'visible'
          }}
        >
          <defs>
            <radialGradient id="teamGlow">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>

            <pattern
              id="teamGrid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.28" />
            </pattern>

            <filter
              id="teamNodeGlow"
              x="-200%"
              y="-200%"
              width="400%"
              height="400%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="teamEdgeFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="35%" stopColor="white" stopOpacity="0.35" />
              <stop offset="50%" stopColor="white" stopOpacity="0.12" />
              <stop offset="65%" stopColor="white" stopOpacity="0.35" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>

            <mask id="teamNetworkMask">
              <rect width="1440" height="700" fill="url(#teamEdgeFade)" />
            </mask>
          </defs>

          <g>
            <circle
              className="team-glow"
              cx="170"
              cy="350"
              r="300"
              fill="url(#teamGlow)"
            />
            <circle
              className="team-glow team-glow-right"
              cx="1270"
              cy="340"
              r="330"
              fill="url(#teamGlow)"
            />
            <circle
              className="team-glow"
              cx="720"
              cy="350"
              r="260"
              fill="url(#teamGlow)"
              opacity="0.25"
              style={{ animationDuration: '13s' }}
            />
          </g>

          <g className="team-grid">
            <rect
              x="-48"
              y="-48"
              width="1536"
              height="796"
              fill="url(#teamGrid)"
            />
          </g>

          <g mask="url(#teamNetworkMask)">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.38"
            >
              <path d="M-30 180 H110 L190 260 H310 L390 180 H480" />
              <path d="M30 420 H130 L210 340 H320 L400 420 H510" />
              <path d="M110 180 V100 H220 L270 150" />
              <path d="M210 340 V480 L300 570" />
              <path d="M390 180 V100 L470 60" />
              <path d="M320 340 L360 390 V490" />
              <path d="M40 300 H100 L140 260" />
              <path d="M250 520 L300 470 H390" />
              <path d="M80 560 V510 L130 460" />
            </g>

            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            >
              <path
                className="team-circuit"
                d="M-30 180 H110 L190 260 H310 L390 180 H480"
              />
              <path
                className="team-circuit-reverse"
                d="M30 420 H130 L210 340 H320 L400 420 H510"
              />
              <path className="team-circuit" d="M110 180 V100 H220 L270 150" />
              <path
                className="team-circuit-reverse"
                d="M210 340 V480 L300 570"
              />
              <path className="team-circuit" d="M320 340 L360 390 V490" />
            </g>

            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.38"
            >
              <path d="M1470 170 H1330 L1250 250 H1130 L1050 170 H960" />
              <path d="M1410 420 H1310 L1230 340 H1120 L1040 420 H930" />
              <path d="M1330 170 V90 H1220 L1170 140" />
              <path d="M1230 340 V480 L1140 570" />
              <path d="M1050 170 V100 L970 60" />
              <path d="M1120 340 L1080 390 V490" />
              <path d="M1400 300 H1340 L1300 260" />
              <path d="M1190 520 L1140 470 H1050" />
              <path d="M1360 560 V510 L1310 460" />
            </g>

            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            >
              <path
                className="team-circuit-reverse"
                d="M1470 170 H1330 L1250 250 H1130 L1050 170 H960"
              />
              <path
                className="team-circuit"
                d="M1410 420 H1310 L1230 340 H1120 L1040 420 H930"
              />
              <path
                className="team-circuit-reverse"
                d="M1330 170 V90 H1220 L1170 140"
              />
              <path className="team-circuit" d="M1230 340 V480 L1140 570" />
              <path
                className="team-circuit-reverse"
                d="M1120 340 L1080 390 V490"
              />
            </g>

            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              filter="url(#teamNodeGlow)"
            >
              <path
                className="team-data-line"
                d="M-30 180 H110 L190 260 H310 L390 180 H480"
              />
              <path
                className="team-data-line team-data-line-delayed"
                d="M30 420 H130 L210 340 H320 L400 420 H510"
              />
              <path
                className="team-data-line"
                d="M1470 170 H1330 L1250 250 H1130 L1050 170 H960"
              />
              <path
                className="team-data-line team-data-line-delayed"
                d="M1410 420 H1310 L1230 340 H1120 L1040 420 H930"
              />
            </g>

            <g fill="currentColor" opacity="0.72">
              {[
                [110, 180],
                [190, 260],
                [310, 260],
                [390, 180],
                [130, 420],
                [210, 340],
                [320, 340],
                [400, 420],
                [110, 100],
                [220, 100],
                [300, 570],
                [360, 490],
                [470, 60],
                [1330, 170],
                [1250, 250],
                [1130, 250],
                [1050, 170],
                [1310, 420],
                [1230, 340],
                [1120, 340],
                [1040, 420],
                [1330, 90],
                [1220, 90],
                [1140, 570],
                [1080, 490],
                [970, 60]
              ].map(([cx, cy], index) => (
                <circle key={index} cx={cx} cy={cy} r="2.4" />
              ))}
            </g>

            <g fill="currentColor" filter="url(#teamNodeGlow)">
              {[
                [110, 180],
                [310, 260],
                [210, 340],
                [400, 420],
                [220, 100],
                [300, 570],
                [1250, 250],
                [1130, 250],
                [1230, 340],
                [1040, 420],
                [1220, 90],
                [1140, 570]
              ].map(([cx, cy], index) => (
                <circle
                  key={index}
                  className="team-node"
                  cx={cx}
                  cy={cy}
                  r="3"
                  style={{ animationDelay: `${(index % 5) * -0.65}s` }}
                />
              ))}
            </g>

            <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.18">
              <circle cx="720" cy="350" r="180" />
              <circle cx="720" cy="350" r="230" />
            </g>

            <g
              className="team-orbit"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.28"
            >
              <circle cx="720" cy="350" r="270" strokeDasharray="4 12" />
              <circle cx="720" cy="350" r="310" strokeDasharray="2 18" />
            </g>

            <g
              className="team-orbit-reverse"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.22"
            >
              <ellipse
                cx="720"
                cy="350"
                rx="220"
                ry="100"
                strokeDasharray="3 14"
              />
            </g>

            <g className="team-orbit" style={{ animationDuration: '32s' }}>
              <circle
                cx="720"
                cy="80"
                r="3.5"
                fill="currentColor"
                className="team-orbit-dot"
              />
              <circle
                cx="720"
                cy="40"
                r="2"
                fill="currentColor"
                opacity="0.6"
              />
            </g>

            <g
              className="team-orbit-reverse"
              style={{ animationDuration: '42s' }}
            >
              <circle
                cx="720"
                cy="80"
                r="2.5"
                fill="currentColor"
                className="team-orbit-dot"
              />
            </g>
          </g>
        </Box>
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: '-15%',
          bottom: -220,
          width: 460,
          height: 460,
          borderRadius: '50%',
          display: { xs: 'none', md: 'block' },
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            0.1
          )}, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          sx={{
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: 760,
            mx: 'auto',
            mb: { xs: 4, md: 6 }
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2,
              px: 1.5,
              py: 0.75,
              alignItems: 'center',
              borderRadius: 10,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.06)
            }}
          >
            <GroupsRoundedIcon sx={{ color: 'primary.main', fontSize: 17 }} />

            <Typography
              sx={{
                color: 'primary.main',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.14em'
              }}
            >
              {eyebrow}
            </Typography>
          </Stack>

          <Typography
            variant="h2"
            sx={{
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: '-0.055em',
              textWrap: 'balance'
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 650,
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.85
            }}
          >
            {description}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: { xs: 4, md: 5 }
          }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <Chip
                key={category}
                label={`${category} · ${categoryCount(category)}`}
                clickable
                onClick={() => {
                  setSelectedCategory(category);
                  setPage(1);
                }}
                variant={isSelected ? 'filled' : 'outlined'}
                color={isSelected ? 'primary' : 'default'}
                sx={{
                  height: 36,
                  px: 0.5,
                  borderRadius: 2,
                  fontWeight: 750,
                  borderColor: alpha(theme.palette.primary.main, 0.25),
                  transition:
                    'background-color 180ms ease, border-color 180ms ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12)
                  }
                }}
              />
            );
          })}
        </Stack>

        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2.5 }}>
          <Box
            sx={{
              width: 4,
              height: 22,
              borderRadius: 2,
              backgroundColor: 'primary.main'
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.15rem', md: '1.35rem' },
              fontWeight: 850,
              letterSpacing: '-0.035em'
            }}
          >
            {selectedCategory === 'All' ? 'All Members' : selectedCategory}
          </Typography>

          <Typography
            sx={{ ml: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
          >
            {filteredMembers.length}{' '}
            {filteredMembers.length === 1 ? 'member' : 'members'}
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Loading team members...
            </Typography>
          </Box>
        ) : loadError ? (
          <Box
            role="alert"
            sx={{
              py: 8,
              px: 2,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}
          >
            <Typography color="error" sx={{ mb: 2 }}>
              Unable to load team members. Please try again.
            </Typography>

            <Chip
              label="Retry"
              clickable
              color="primary"
              onClick={() => {
                setLoadError(false);
                setLoading(true);

                void fetchTeamMembers()
                  .then((result) => {
                    setFetchedMembers(result);
                  })
                  .catch((error) => {
                    console.error('Failed to reload team members:', error);
                    setLoadError(true);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            />
          </Box>
        ) : visibleMembers.length > 0 ? (
          <Grid
            key={`${selectedCategory}-${page}`}
            container
            spacing={2.5}
            sx={{
              justifyContent: 'center',
              alignItems: 'stretch',
              animation: 'teamPageEnter 280ms ease',
              '@keyframes teamPageEnter': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none'
              }
            }}
          >
            {visibleMembers.map((member) => (
              <Grid
                key={`${member.name}-${member.role}`}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              >
                <TeamMemberCard
                  member={member}
                  onClick={() =>
                    setSelectedMember(member as ExtendedTeamMember)
                  }
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: 3
            }}
          >
            <Typography color="text.secondary">
              No members found in this category.
            </Typography>
          </Box>
        )}

        {!loading && !loadError && pageCount >= 1 && (
          <Stack
            spacing={1.5}
            sx={{ alignItems: 'center', mt: { xs: 4, md: 5 } }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, nextPage) => setPage(nextPage)}
              color="primary"
              shape="rounded"
              size="large"
              siblingCount={1}
              boundaryCount={1}
              aria-label="Team member pages"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 700,
                  borderRadius: 2
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.18)}`
                }
              }}
            />

            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                textAlign: 'center'
              }}
              aria-live="polite"
            >
              Showing {(page - 1) * membersPerPage + 1}
              {'–'}
              {Math.min(page * membersPerPage, filteredMembers.length)}
              {' of '}
              {filteredMembers.length} members
            </Typography>
          </Stack>
        )}
      </Container>

      {/* NEW: one reusable modal, populated with the selected member's data. */}
      <TeamMemberModal
        member={selectedMember}
        open={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
      />
    </Box>
  );
}
