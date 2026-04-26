export const VIEW_AS_TIERS = ['public', 'friends', 'close_friends'] as const;
export type VisibilityTier = (typeof VIEW_AS_TIERS)[number];

export const isVisibilityTier = (value: unknown): value is VisibilityTier =>
  typeof value === 'string' && (VIEW_AS_TIERS as readonly string[]).includes(value);
