import { CheckInBase, SocialBattery } from '@models/checkIn';
import { DayQuestion, RecentPost } from '@models/post';
import { User } from '@models/user';
import { PaginationResponse } from './common';
import { GetMomentResponse } from './moment';

export type GetFriendsTodayResponse = FriendToday[];

export interface FriendToday extends User {
  moments?: GetMomentResponse[];
  questions?: DayQuestion[];
  check_in?: CheckInBase;
}

export type GetUpdatedProfileResponse = PaginationResponse<UpdatedProfile[]>;

export interface UpdatedProfile extends User {
  is_favorite: boolean;
  is_hidden: boolean;
  current_user_read: boolean;
  unread_cnt: number;
  track_id?: string;
  description: string;
  mood?: string;
  unread_ping_count: number;
  social_battery?: SocialBattery | null;
  recent_post?: RecentPost;
}

export type GetAllFriendsResponse = PaginationResponse<UpdatedProfile[]>;
export type GetFavoriteFriendsResponse = PaginationResponse<UpdatedProfile[]>;

export enum Connection {
  FRIEND = 'friend',
  CLOSE_FRIEND = 'close_friend',
}

export type FriendType = 'all' | 'close_friends';
