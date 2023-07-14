import { TodayMoment } from '@models/moment';
import { DateRequestParams } from './common';

// GET today's moment
export interface GetMomentResponse extends TodayMoment {
  id: number;
  type: 'Moment';
  like_count: number;
  current_user_liked: boolean;
  date: string;
  created_at: string;
}

// POST today's moment
export interface PostMomentRequest extends DateRequestParams {
  moment: TodayMoment;
}

export interface PostMomentResponse extends TodayMoment {}

// PUT today's moment
export interface UpdateMomentRequest extends PostMomentRequest {}

export interface UpdateMomentResponse extends TodayMoment {}
