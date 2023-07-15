import { DateRequestParams, PaginationResponse } from '@models/api/common';
import { Comment, DayQuestion } from '@models/post';
import axios from './axios';

export const getDayQuestions = async ({ year, month, day }: DateRequestParams) => {
  const { data } = await axios.get<DayQuestion[]>(`/feed/responses/${year}/${month}/${day}/`);
  return data;
};

export const deleteResponse = async (responseId: number) => {
  return axios.delete(`/feed/responses/${responseId}/`);
};

export const getCommentsOfResponse = async (responseId: number) => {
  const { data } = await axios.get<PaginationResponse<Comment[][]>>(
    `/feed/responses/comments/${responseId}/`,
  );
  return data?.results || [[]];
};
