import { GetAllQuestionsResponse } from '@models/api/todayQuestions';
import { ShortAnswerQuestion } from '@models/post';
import axios from './axios';

// GET today's questions
export const getTodayQuestions = async () => {
  const { data } = await axios.get<ShortAnswerQuestion[]>(`/feed/questions/daily`);
  return data;
};

// GET all questions
export const getAllQuestions = async () => {
  const { data } = await axios.get<GetAllQuestionsResponse>(`/feed/questions`);
  return data;
};
