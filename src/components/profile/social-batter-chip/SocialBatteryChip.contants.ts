import { SocialBattery } from '@models/checkIn';

export const SocialBatteryChipAssets: Record<SocialBattery, { emoji: string | null }> = {
  completely_drained: { emoji: '💤' },
  low: { emoji: '🪫' },
  needs_recharge: { emoji: '🔌' },
  moderately_social: { emoji: '🔋' },
  fully_charged: { emoji: '🚀' },
  super_social: { emoji: '🤩' },
};
