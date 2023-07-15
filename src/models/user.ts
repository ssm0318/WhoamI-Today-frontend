export interface User {
  id: number;
  profile_image: string | null;
  profile_pic: string;
  url: string;
  username: string;
}

export interface UserProfile extends User {
  are_friends: boolean;
  received_friend_request_from: boolean;
  sent_friend_request_to: boolean;
}
