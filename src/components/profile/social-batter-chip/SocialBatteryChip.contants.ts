import { SocialBattery } from '@models/checkIn';

export const SocialBatteryLabels: Record<SocialBattery, string> = {
  completely_drained: 'Completely Drained',
  low: 'Low Social Battery',
  needs_recharge: 'Needs Recharge',
  moderate: 'Moderate',
  fully_charged: 'Fully Charged',
  super_social: 'Super Social Mode (HMU!)',
};

export const SocialBatteryChipAssets: Record<SocialBattery, { emoji: string | null }> = {
  completely_drained: { emoji: '💤' },
  low: { emoji: '🔋' },
  needs_recharge: { emoji: '🔌' },
  moderate: { emoji: '😐' },
  fully_charged: { emoji: '🚀' },
  super_social: { emoji: '🎉' },
};
