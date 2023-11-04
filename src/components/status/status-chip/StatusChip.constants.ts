import { ColorKeys } from '@design-system';
import { Availability } from '@models/status';

export const AvailabilityLabels: Record<Availability, string> = {
  AVAILABLE: 'Available',
  NO_STATUS: 'No Status',
  MAYBE_SLOW: 'Maybe Slow',
  NOT_AVAILABLE: 'Not Available',
};

export const AvailabilityBgColors: Record<Availability, ColorKeys> = {
  AVAILABLE: 'AVAILABLE_BG',
  NO_STATUS: 'NO_STATUS_BG',
  MAYBE_SLOW: 'MAYBE_SLOW_BG',
  NOT_AVAILABLE: 'NOT_AVAILABLE_BG',
};

export const AvailabilityChipColors: Record<Availability, ColorKeys> = {
  AVAILABLE: 'AVAILABLE_CHIP',
  NO_STATUS: 'NO_STATUS_CHIP',
  MAYBE_SLOW: 'MAYBE_SLOW_CHIP',
  NOT_AVAILABLE: 'NOT_AVAILABLE_CHIP',
};
