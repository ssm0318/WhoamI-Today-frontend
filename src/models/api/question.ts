import { Question, Response } from '@models/post';

export interface ResponseQuestionRequestParams {
  question_id: number;
  content: string;
}

export interface GetResponseHistoriesResponse extends Question {
  response_set: Response[];
}
