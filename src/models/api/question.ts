import { Question, Response } from '@models/post';

export interface ResponseQuestionRequestParams {
  question_id: number;
  content: string;
  share_friends?: unknown;
  share_groups?: unknown;
}

export interface GetResponseHistoriesResponse extends Question {
  response_set: Response[];
}
