import { DateRequestParams, PaginationResponse } from '@models/api/common';
import { GetResponseDetailResponse } from '@models/api/response';
import { Comment, DayQuestion, Reaction, ReactionPostType } from '@models/post';
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
  // TODO: 페이지네이션 작업시 수정
  return data?.results || [[]];
};

export const getResponse = async (responseId: number | string) => {
  const { data } = await axios.get<GetResponseDetailResponse>(`/feed/responses/${responseId}/`);
  return data;
};

// GET Reaction List
export const getReactionList = async (
  postType: ReactionPostType,
  postId: number,
  next?: string | null,
) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Reaction[]>>(
    `/reactions/${postType}/${postId}/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

// POST Reaction
export const postReaction = async (postType: ReactionPostType, postId: number, emoji: string) => {
  await axios.post(`/reactions/${postType}/${postId}`, { emoji });
};
