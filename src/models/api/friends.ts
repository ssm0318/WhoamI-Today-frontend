import { CheckInBase } from '@models/checkIn';
import { DayQuestion } from '@models/post';
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
  unread_ping_count: number;
}

export type GetAllFriendsResponse = PaginationResponse<UpdatedProfile[]>;
export type GetFavoriteFriendsResponse = PaginationResponse<UpdatedProfile[]>;
