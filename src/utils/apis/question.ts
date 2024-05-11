import { PaginationResponse } from '@models/api/common';
import { ResponseQuestionRequestParams } from '@models/api/question';
import { DailyQuestion, Question, Response } from '@models/post';
import axios from './axios';

// GET today's questions
export const getTodayQuestions = async () => {
  const { data } = await axios.get<DailyQuestion[]>(`/qna/questions/daily/`);
  return data;
};

// GET all questions (pagination)
export const getAllQuestions = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Question[]>>(
    `/qna/questions/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

// GET question detail
export const getQuestionDetail = async (id: string) => {
  const { data } = await axios.get<Question>(`/qna/questions/${id}/`);
  return data;
};

export const requestResponse = async ({
  currentUserId,
  questionId,
  selectedFriends,
  message,
  onSuccess,
  onError,
}: {
  currentUserId: number;
  questionId: number;
  selectedFriends: number[];
  message?: string;
  onSuccess: () => void;
  onError: () => void;
}) => {
  Promise.all(
    selectedFriends.map((friend) =>
      axios.post(`/qna/questions/response-request/`, {
        requester_id: currentUserId,
        requestee_id: friend,
        question_id: questionId,
        message,
      }),
    ),
  )
    .then(() => onSuccess())
    .catch(() => onError());
};

export const responseQuestion = async ({
  question_id,
  content,
  share_friends = [],
  share_groups = [],
}: ResponseQuestionRequestParams) => {
  const { data } = await axios.post<Response>(`/qna/responses/`, {
    question_id,
    content,
    share_friends,
    share_groups,
  });
  return data;
};
