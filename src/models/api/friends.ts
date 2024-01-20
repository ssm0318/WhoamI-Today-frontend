import { DayQuestion } from '@models/post';
import { User } from '@models/user';
import { PaginationResponse } from './common';
import { GetMomentResponse } from './moment';

export type GetFriendsTodayResponse = FriendToday[];

export interface FriendToday extends User {
  moments?: GetMomentResponse[];
  questions?: DayQuestion[];
}

export type GetUpdatedProfileResponse = PaginationResponse<UpdatedProfile[]>;

export interface UpdatedProfile extends User {
  is_favorite: boolean;
  is_hidden: boolean;
  current_user_read: boolean;
}
