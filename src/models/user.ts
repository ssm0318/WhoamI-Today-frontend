import { CheckInBase } from './checkIn';

export interface User {
  id: number;
  profile_image: string | null;
  profile_pic: string;
  url: string;
  username: string;
  bio: string;
  pronouns: string;
}

export interface UserProfile extends User {
  are_friends: boolean;
  received_friend_request_from: boolean;
  sent_friend_request_to: boolean;
  check_in: CheckInBase;
  mutuals: User[];
  is_favorite: boolean;
}
