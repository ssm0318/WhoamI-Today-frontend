import { DayQuestion } from '@models/post';
import { User } from '@models/user';
import { GetMomentResponse } from './moment';

export type GetFriendsTodayResponse = FriendToday[];

export interface FriendToday extends User {
  moments?: GetMomentResponse[];
  questions?: DayQuestion[];
}
