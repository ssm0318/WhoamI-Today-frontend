/**
 * Chip category system — colors and types live here,
 * chip names are fetched from the backend (single source of truth).
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

/** Shape returned by GET /user/chip-categories/ */
export interface ChipCategoryData {
  key: string;
  label: string;
  description: string;
  chips: string[];
}

/** Full category info used by components (API data + local colors). */
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

export const MAX_CUSTOM_CHIPS_PER_CATEGORY = 15;
export const MAX_CUSTOM_CHIP_LENGTH = 25;

/** Per-category color scheme (WCAG AA compliant). */
export const CHIP_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  [ChipCategory.MUSIC_ENTERTAINMENT]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
  [ChipCategory.HOBBIES_ACTIVITIES]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
  [ChipCategory.ON_MY_MIND]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
  [ChipCategory.AS_A_FRIEND]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
  [ChipCategory.ONLINE_PERSONA]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
  [ChipCategory.FAVORITE_PLATFORM]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
  [ChipCategory.LEAST_FAVORITE_PLATFORM]: { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' },
};

const DEFAULT_COLORS = { bg: '#F3E8FF', text: '#8700FF', border: '#8700FF' };

/** Merge backend category data with local colors. */
export function toChipCategoryInfo(data: ChipCategoryData): ChipCategoryInfo {
  return {
    ...data,
    key: data.key as ChipCategory,
    colors: CHIP_CATEGORY_COLORS[data.key] ?? DEFAULT_COLORS,
  };
}

/**
 * Normalize chip text for comparison (case-insensitive matching for custom chips).
 */
export function normalizeChipText(text: string): string {
  return text.trim().toLowerCase();
}
