export interface User {
  id: number;
  profile_image: string | null;
  profile_pic: string;
  url: string;
  username: string;
  check_in?: CheckIn | null;
}

export interface UserProfile extends User {
  are_friends: boolean;
  received_friend_request_from: boolean;
  sent_friend_request_to: boolean;
}

export enum Availability {
  NoStatus = 'no_status',
  NotAvailable = 'not_available',
  MayBeSlow = 'may_be_slow',
  Available = 'available',
}

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
