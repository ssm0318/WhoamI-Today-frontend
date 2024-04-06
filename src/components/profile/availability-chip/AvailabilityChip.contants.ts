import { IconNames } from '@design-system';
import { Availability } from '@models/checkIn';

export const AvailabilityLabels: Record<Availability, string> = {
  available: 'Available',
  busy: 'Busy',
  might_get_distracted: 'Might get distracted',
  urgent_only: 'Urgent only',
  about_to_sleep: 'About to sleep',
  studying: 'Studying',
  in_transit: 'In transit',
  feeling_social: 'Feeling social',
  feeling_quiet: 'Feeling quiet',
};

export const AvailabilityChipAssets: Record<
  Availability,
  { icon: IconNames | null; emoji: string | null }
> = {
  available: { icon: 'availability_available', emoji: null },
  busy: { icon: 'availability_busy', emoji: null },
  might_get_distracted: { icon: 'availability_might_get_distracted', emoji: null },
  urgent_only: { icon: 'availability_urgent_only', emoji: null },
  about_to_sleep: { icon: null, emoji: '😴' },
  studying: { icon: null, emoji: '✍🏼' },
  in_transit: { icon: null, emoji: '🚌' },
  feeling_social: { icon: null, emoji: '👯' },
  feeling_quiet: { icon: null, emoji: '😶' },
};
