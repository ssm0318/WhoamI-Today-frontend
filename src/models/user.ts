import { Connection } from '@models/api/friends';
import { MyProfile } from './api/user';
import { CheckInBase } from './checkIn';
import { Persona } from './persona';

export interface User {
  id: number;
  profile_image: string | null;
  profile_pic: string;
  url: string;
  username: string;
  email?: string;
  bio: string;
  pronouns: string;
  persona: Persona[];
  has_changed_pw?: boolean;
  unread_noti_cnt?: number;
  unread_ping_count?: number;
  connection_status: Connection | null;
}

export interface UserFollowStatus {
  is_following: boolean; // 내가 팔로우하고 있는지
  is_followed_by: boolean; // 나를 팔로우하고 있는지
  sent_follow_request_to: boolean; // 내가 팔로우 요청을 보냈는지
  received_follow_request_from: boolean; // 내가 팔로우 요청을 받았는지
}

export interface UserProfile extends User, UserFollowStatus {
  are_friends: boolean;
  received_friend_request_from: boolean;
  sent_friend_request_to: boolean;
  check_in: CheckInBase;
  mutuals: User[];
  is_favorite: boolean;
}

export const areFriends = (user: User | UserProfile): user is UserProfile =>
  (user as UserProfile).are_friends === true;

export const sentFriendRequest = (user: User | UserProfile) =>
  (user as UserProfile).sent_friend_request_to === true;

export const receivedFriendRequest = (user: User | UserProfile) =>
  (user as UserProfile).received_friend_request_from === true;

export const isMyProfile = (profile: MyProfile | UserProfile): profile is MyProfile =>
  (profile as UserProfile).are_friends === undefined;
