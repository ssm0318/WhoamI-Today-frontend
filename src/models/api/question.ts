import { Question, Response } from '@models/post';

export interface ResponseQuestionRequestParams {
  question_id?: number;
  post_id?: number;
  content: string;
  visibility: string;
  share_friends?: unknown;
  share_groups?: unknown;
  share_everyone?: unknown;
}

export interface GetResponseHistoriesResponse extends Question {
  response_set: Response[];
}

export interface ResponseRequest {
  id: number;
  requester_id: number;
  requestee_id: number;
  question_id: number;
  message: string;
  created_at: string;
  is_recent: boolean; // 최근 7일 true, 최근 30일 false
  requester_username_list: string[];
  question_content: string;
}
