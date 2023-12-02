import { ColorKeys } from '@design-system';
import { Availability } from '@models/checkIn';

export const AvailabilityLabels: Record<Availability, string> = {
  available: 'Available',
  no_status: 'No Status',
  may_be_slow: 'Maybe Slow',
  not_available: 'Not Available',
};

export const AvailabilityBgColors: Record<Availability, ColorKeys> = {
  available: 'AVAILABLE_BG',
  no_status: 'NO_STATUS_BG',
  may_be_slow: 'MAYBE_SLOW_BG',
  not_available: 'NOT_AVAILABLE_BG',
};

export const AvailabilityChipColors: Record<Availability, ColorKeys> = {
  available: 'AVAILABLE_CHIP',
  no_status: 'NO_STATUS_CHIP',
  may_be_slow: 'MAYBE_SLOW_CHIP',
  not_available: 'NOT_AVAILABLE_CHIP',
};
