import { TodayMoment } from '@models/moment';
import { AdminAuthor } from '@models/post';
import { User } from '@models/user';
import { DateRequestParams } from './common';

// GET today's moment
export interface GetMomentResponse extends TodayMoment {
  id: number;
  type: 'Moment';
  like_count: number | null;
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

export interface GetMomentDetailResponse extends GetMomentResponse {
  author: string | null;
  author_detail: User | AdminAuthor;
}
