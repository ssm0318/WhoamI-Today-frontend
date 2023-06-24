import { GetAllQuestionsResponse } from '@models/api/todayQuestions';
import { ShortAnswerQuestion } from '@models/post';
import axios from './axios';

// GET today's questions
export const getTodayQuestions = async () => {
  const { data } = await axios.get<ShortAnswerQuestion[]>(`/feed/questions/daily`);
  return data;
};

// GET all questions (pagination)
export const getAllQuestions = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<GetAllQuestionsResponse>(
    `/feed/questions/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
