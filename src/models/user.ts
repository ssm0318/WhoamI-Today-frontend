import { CheckIn } from './status';

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
