import { TodayMoment } from '@models/moment';
import { Comment } from '@models/post';

export interface MomentRequestParams {
  year: number;
  month: number;
  day: number;
}

// GET today's moment
export interface GetMomentResponse extends TodayMoment {
  id: number;
  type: 'Moment';
  like_count: number;
  current_user_liked: boolean;
  date: string;
  created_at: string;
  comments: Comment[];
}

// POST today's moment
export interface PostMomentParams extends TodayMoment {}

export interface PostMomentRequest extends MomentRequestParams {
  moment: TodayMoment;
}

// PUT today's moment
export interface UpdateMomentRequest extends PostMomentRequest {}
