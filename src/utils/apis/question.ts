import { PaginationResponse } from '@models/api/common';
import { ResponseQuestionRequestParams, ResponseQuestionResponse } from '@models/api/question';
import { ShortAnswerQuestion } from '@models/post';
import { getYearMonthDayFromDate } from '@utils/timeHelpers';
import axios from './axios';

// GET today's questions
export const getTodayQuestions = async () => {
  const { data } = await axios.get<ShortAnswerQuestion[]>(`/feed/questions/daily/`);
  return data;
};

// GET all questions (pagination)
export const getAllQuestions = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<ShortAnswerQuestion[]>>(
    `/feed/questions/${!requestPage ? '' : `?page=${requestPage}/`}`,
  );
  return data;
};

// GET question detail
export const getQuestionDetail = async (id: number) => {
  const { data } = await axios.get<ShortAnswerQuestion>(`/feed/questions/${id}/`);
  return data;
};

export const requestResponse = async (
  currentUserId: number,
  questionId: number,
  selectedFriendIdList: number[],
) => {
  Promise.all(
    selectedFriendIdList.map((friend) =>
      axios.post(`/feed/questions/response-request/`, {
        requester_id: currentUserId,
        requestee_id: friend,
        question_id: questionId,
      }),
    ),
  );
};

// POST response today's question
export const responseQuestion = async (params: ResponseQuestionRequestParams) => {
  const { year, month, day } = getYearMonthDayFromDate(new Date());
  const { data } = await axios.post<ResponseQuestionResponse>(
    `/feed/responses/${year}/${month}/${day}/`,
    params,
  );

  return data;
};
