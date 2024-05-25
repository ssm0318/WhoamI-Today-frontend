import { DateRequestParams, PaginationResponse } from '@models/api/common';
import { GetResponseDetailResponse, GetResponsesResponse } from '@models/api/response';
import { Comment, DayQuestion, Reaction, ReactionPostType } from '@models/post';
import axios from './axios';

export const getResponses = async () => {
  const {
    data: { results },
  } = await axios.get<PaginationResponse<GetResponsesResponse>>(`/qna/responses/`);
  return results ?? [];
};

export const getDayQuestions = async ({ year, month, day }: DateRequestParams) => {
  const { data } = await axios.get<DayQuestion[]>(`/qna/responses/${year}/${month}/${day}/`);
  return data;
};

export const deleteResponse = async (responseId: number) => {
  return axios.delete(`/qna/responses/${responseId}/`);
};

export const getCommentsOfResponse = async (responseId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Comment[]>>(
    `/qna/responses/${responseId}/comments${!requestPage ? '' : `?page=${requestPage}`}`,
  );

  return data;
};

export const getResponse = async (responseId: number | string) => {
  const { data } = await axios.get<GetResponseDetailResponse>(`/qna/responses/${responseId}/`);
  const { id, current_user_read } = data;

  if (!current_user_read) {
    readResponse([id]);
  }

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

export const readResponse = async (ids: number[]) => {
  await axios.patch('/qna/responses/read/', { ids });
};
