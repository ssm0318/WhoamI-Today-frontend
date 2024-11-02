import { DateRequestParams, PaginationResponse } from '@models/api/common';
import { GetResponseDetailResponse, GetResponsesResponse } from '@models/api/response';
import { Comment, DayQuestion, PostReaction } from '@models/post';
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

export const deleteResponse = async ({
  responseId,
  onSuccess,
  onError,
}: {
  responseId: number;
  onSuccess: () => void;
  onError: () => void;
}) => {
  return axios
    .delete(`/qna/responses/${responseId}/`)
    .then(() => onSuccess())
    .catch(() => onError());
};

export const getCommentsOfResponse = async (responseId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Comment[]>>(
    `/qna/responses/${responseId}/comments${!requestPage ? '' : `?page=${requestPage}`}`,
  );

  return data;
};

export const getResponse = async (responseId: number | string | undefined) => {
  const { data } = await axios.get<GetResponseDetailResponse>(`/qna/responses/${responseId}/`);
  const { id, current_user_read } = data;

  if (!current_user_read) {
    readResponse([id]);
  }

  return data;
};

export const readResponse = async (ids: number[]) => {
  await axios.patch('/qna/responses/read/', { ids });
};

export const getResponseReactions = async (responseId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<PostReaction[]>>(
    `/qna/responses/${responseId}/interactions/${!requestPage ? '' : `?page=${requestPage}`}`,
  );

  return data;
};
