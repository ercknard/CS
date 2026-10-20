
import supabase from './supabase';

export type TeamCategory = 'Admins' | 'Team' | 'Moderators';

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  description: string;
  skills: string[];
  accent: string;
  email: string;
  category: TeamCategory;
  discordId: string;
  discordAvatar: string;

  // Extended profile details
  bio?: string | null;
  expertise?: string[] | null;
  achievements?: string[] | null;
  projects?: string[] | null;
  location?: string | null;
  availability?: string | null;

  // Social profiles
  website?: string | null;
  twitter?: string | null;
  github?: string | null;
  linkedin?: string | null;

  image?: string;
}

interface TeamMemberRow {
  name: string;
  role: string;
  initials: string;
  description: string | null;
  skills: string[] | null;
  accent: string;
  email: string;
  category: string;

  discord_id: string | null;
  discord_avatar: string | null;

  bio: string | null;
  expertise: string[] | null;
  achievements: string[] | null;
  projects: string[] | null;
  location: string | null;
  availability: string | null;

  website: string | null;
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
}

const validCategories: TeamCategory[] = [
  'Admins',
  'Team',
  'Moderators'
];

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('sc_team_members')
    .select(`
      name,
      role,
      initials,
      description,
      skills,
      accent,
      email,
      category,
      discord_id,
      discord_avatar,
      bio,
      expertise,
      achievements,
      projects,
      location,
      availability,
      website,
      twitter,
      github,
      linkedin
    `)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error.message);
    throw new Error('Unable to load team members.');
  }

  const rows = (data ?? []) as unknown as TeamMemberRow[];

  return rows.flatMap((member): TeamMember[] => {
    if (!validCategories.includes(member.category as TeamCategory)) {
      console.warn(`Invalid team category for ${member.name}`);
      return [];
    }

    return [
      {
        name: member.name,
        role: member.role,
        initials: member.initials,
        description: member.description ?? '',
        skills: member.skills ?? [],
        accent: member.accent,
        email: member.email,
        category: member.category as TeamCategory,

        discordId: member.discord_id ?? '',
        discordAvatar: member.discord_avatar ?? '',

        bio: member.bio,
        expertise: member.expertise ?? [],
        achievements: member.achievements ?? [],
        projects: member.projects ?? [],
        location: member.location,
        availability: member.availability,

        website: member.website,
        twitter: member.twitter,
        github: member.github,
        linkedin: member.linkedin
      }
    ];
  });
}
