export type Availability = 'AVAILABLE' | 'NO_STATUS' | 'MAYBE_SLOW' | 'NOT_AVAILABLE';

export type Status = {
  availability: Availability;
  bio: string;
  description: string;
  emoji: string;
  trackId: string;
};
