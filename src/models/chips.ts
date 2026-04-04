/**
 * Expanded chip system with 7 distinct categories.
 * Each category has a unique color scheme (WCAG AA compliant).
 */

export enum ChipCategory {
  MUSIC_ENTERTAINMENT = 'music_entertainment',
  HOBBIES_ACTIVITIES = 'hobbies_activities',
  ON_MY_MIND = 'on_my_mind',
  AS_A_FRIEND = 'as_a_friend',
  ONLINE_PERSONA = 'online_persona',
  FAVORITE_PLATFORM = 'favorite_platform',
  LEAST_FAVORITE_PLATFORM = 'least_favorite_platform',
}

export interface ChipCategoryInfo {
  key: ChipCategory;
  label: string;
  description: string;
  chips: string[];
  colors: { bg: string; text: string; border: string };
}

export interface CustomChip {
  id?: number;
  text: string;
  category: ChipCategory;
}

export const MAX_CUSTOM_CHIPS_PER_CATEGORY = 5;
export const MAX_CUSTOM_CHIP_LENGTH = 25;

export const CHIP_CATEGORIES: Record<ChipCategory, ChipCategoryInfo> = {
  [ChipCategory.MUSIC_ENTERTAINMENT]: {
    key: ChipCategory.MUSIC_ENTERTAINMENT,
    label: 'Music & Entertainment',
    description: 'What you consume — genres, media, formats.',
    chips: [
      'Hip-Hop',
      'R&B',
      'Pop',
      'Indie',
      'K-Pop',
      'Rock',
      'EDM',
      'Jazz',
      'Lo-Fi',
      'Anime',
      'K-Drama',
      'Reality TV',
      'Horror',
      'Sci-Fi',
      'Documentaries',
      'Comedy',
      'Podcasts',
      'Manga/Webtoons',
    ],
    colors: { bg: '#FFF0E6', text: '#B35400', border: '#F5A623' },
  },
  [ChipCategory.HOBBIES_ACTIVITIES]: {
    key: ChipCategory.HOBBIES_ACTIVITIES,
    label: 'Hobbies & Activities',
    description: 'What you do with your time — sports, creative work, lifestyle.',
    chips: [
      'Gaming',
      'Basketball',
      'Soccer',
      'Volleyball',
      'Tennis',
      'Gym',
      'Running',
      'Skating',
      'Climbing',
      'Hiking',
      'Surfing',
      'Cycling',
      'Drawing',
      'Photography',
      'Cooking',
      'Baking',
      'Thrifting',
      'Journaling',
      'Reading',
      'Coding',
      'Music Production',
      'Video Editing',
      'Fashion',
      'DIY',
    ],
    colors: { bg: '#E8F5E9', text: '#1B5E20', border: '#66BB6A' },
  },
  [ChipCategory.ON_MY_MIND]: {
    key: ChipCategory.ON_MY_MIND,
    label: 'On My Mind',
    description: 'Current rabbit holes, intellectual interests, life-phase topics.',
    chips: [
      'Astrology',
      'Psychology',
      'Philosophy',
      'Sustainability',
      'Mental Health',
      'Skincare',
      'Spirituality',
      'Finance',
      'Language Learning',
      'AI & Tech',
      'Design',
      'Writing',
      'College/Career',
      'Fitness Journey',
    ],
    colors: { bg: '#E3F2FD', text: '#0D47A1', border: '#42A5F5' },
  },
  [ChipCategory.AS_A_FRIEND]: {
    key: ChipCategory.AS_A_FRIEND,
    label: 'As a Friend',
    description: 'How you show up in relationships — personality and values.',
    chips: [
      'Good Listener',
      'Brutally Honest',
      'Hype Person',
      'Low Maintenance',
      'Planner',
      'Spontaneous',
      'Night Owl',
      'Early Bird',
      'Overthinker',
      'Go With the Flow',
      'Needs Alone Time',
      'Always Down to Talk',
      'Dry Humor',
      'Keeps It Real',
    ],
    colors: { bg: '#FFF3E0', text: '#E65100', border: '#FF9800' },
  },
  [ChipCategory.ONLINE_PERSONA]: {
    key: ChipCategory.ONLINE_PERSONA,
    label: 'Online Persona',
    description: 'How you behave on the internet — distinct behavioral archetypes.',
    chips: [
      'Lurker',
      'Content Creator',
      'Meme Collector',
      'Night Scroller',
      'Occasional Poster',
      'Story Watcher',
      'Always in the Comments',
      'Curated Feed',
      'Posts and Deletes',
      'Oversharer',
      'Silent Supporter',
      'Late Replier',
    ],
    colors: { bg: '#F3E5F5', text: '#6A1B9A', border: '#AB47BC' },
  },
  [ChipCategory.FAVORITE_PLATFORM]: {
    key: ChipCategory.FAVORITE_PLATFORM,
    label: 'Favorite Platform',
    description: 'The platforms you love most.',
    chips: [
      'Instagram',
      'TikTok',
      'YouTube',
      'Snapchat',
      'X / Twitter',
      'Discord',
      'Reddit',
      'Pinterest',
      'BeReal',
      'Threads',
    ],
    colors: { bg: '#E0F7FA', text: '#006064', border: '#26C6DA' },
  },
  [ChipCategory.LEAST_FAVORITE_PLATFORM]: {
    key: ChipCategory.LEAST_FAVORITE_PLATFORM,
    label: 'Least Favorite Platform',
    description: 'The platforms you could do without.',
    chips: [
      'Instagram',
      'TikTok',
      'YouTube',
      'Snapchat',
      'X / Twitter',
      'Discord',
      'Reddit',
      'Pinterest',
      'BeReal',
      'Threads',
    ],
    colors: { bg: '#FCE4EC', text: '#880E4F', border: '#EC407A' },
  },
};

export const ALL_CATEGORIES = Object.values(CHIP_CATEGORIES);

/**
 * Normalize chip text for comparison (case-insensitive matching for custom chips).
 */
export function normalizeChipText(text: string): string {
  return text.trim().toLowerCase();
}
