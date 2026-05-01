import { Connection } from '@models/api/friends';
import { MyProfile } from './api/user';
import { CheckInBase, ComponentVisibility } from './checkIn';

export interface User {
  id: number;
  profile_image: string | null;
  profile_pic: string;
  url: string;
  username: string;
  email?: string;
  name?: string | null;
  bio: string;
  pronouns: string;
  has_changed_pw?: boolean;
  unread_noti_cnt?: number;
  unread_chat_count?: number;
  unread_message_cnt?: number;
  connection_status: Connection | null;
  user_interests: string[]; // ['#hiking', '#dogs']과 같은 형식
  user_personas: string[]; // ['#lurker', '#openbook']과 같은 형식
  // 4-way visibility (only present on MyProfile responses; absent on others)
  name_visibility?: ComponentVisibility;
  pronouns_visibility?: ComponentVisibility;
  bio_visibility?: ComponentVisibility;
  music_entertainment_visibility?: ComponentVisibility;
  hobbies_activities_visibility?: ComponentVisibility;
  on_my_mind_visibility?: ComponentVisibility;
  as_a_friend_visibility?: ComponentVisibility;
  online_persona_visibility?: ComponentVisibility;
  favorite_platform_visibility?: ComponentVisibility;
  least_favorite_platform_visibility?: ComponentVisibility;
  basic_identities_visibility?: ComponentVisibility;
  values_allyship_visibility?: ComponentVisibility;
  // Mutual counts (injected by discover feed API)
  mutual_friend_count?: number;
  mutual_interest_count?: number;
  mutual_persona_count?: number;
}

export interface UserFollowStatus {
  is_following: boolean; // 내가 팔로우하고 있는지
  is_followed_by: boolean; // 나를 팔로우하고 있는지
  sent_follow_request_to: boolean; // 내가 팔로우 요청을 보냈는지
  received_follow_request_from: boolean; // 내가 팔로우 요청을 받았는지
}

export interface MutualTrait {
  id: number;
  content: string;
}

export interface UserProfile extends User, UserFollowStatus {
  are_friends: boolean;
  received_friend_request_from: boolean;
  sent_friend_request_to: boolean;
  sent_chat_request_to: boolean;
  received_chat_request_from: number | null;
  check_in: CheckInBase;
  mutuals: User[];
  mutual_interests?: MutualTrait[];
  mutual_personas?: MutualTrait[];
  is_favorite: boolean;
  is_check_in_subscribed?: boolean;
  is_subscribed?: boolean;
  pinned_cnt?: number;
  friendship_level?: string;
  // LinkedIn-style connection degree: 1 = direct friend, 2 = friend of friend, 3+ = further
  connection_degree?: number;
}

export const areFriends = (user: User | UserProfile): user is UserProfile =>
  (user as UserProfile).are_friends === true;

export const sentFriendRequest = (user: User | UserProfile) =>
  (user as UserProfile).sent_friend_request_to === true;

export const receivedFriendRequest = (user: User | UserProfile) =>
  (user as UserProfile).received_friend_request_from === true;

export const isMyProfile = (profile: MyProfile | UserProfile): profile is MyProfile =>
  (profile as UserProfile).are_friends === undefined;
