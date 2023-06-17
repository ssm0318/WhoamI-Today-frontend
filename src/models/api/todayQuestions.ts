import { ShortAnswerQuestion } from '@models/post';

// GET all questions
export interface GetAllQuestionsResponse {
  results: ShortAnswerQuestion[];
  next: string | null;
}
