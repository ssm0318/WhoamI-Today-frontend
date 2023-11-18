export type Availability = 'no_status' | 'not_available' | 'may_be_slow' | 'available';

export type CheckIn = {
  id: number;
  is_active: boolean;
  created_at: string;
  mood: string;
  availability: Availability;
  description: string;
  bio: string;
  track_id: string;
  current_user_read: true;
};
