import { ShortAnswerQuestion } from '@models/post';

// GET all questions
export interface GetAllQuestionsResponse {
  results: ShortAnswerQuestion[];
  next: string | null; // 다음 호출해야하는 api 전체
  previous: string | null;
  count: number;
}
