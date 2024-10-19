import { PaginationResponse } from '@models/api/common';
import { Reaction, ReactionPostType } from '@models/post';
import axios from './axios';

// POST Reaction
export const postReaction = async (postType: ReactionPostType, postId: number, emoji: string) => {
  await axios.post(`/reactions/${postType}/${postId}/`, { emoji });
};

// GET Reaction List
export const getReactionList = async (
  postType: ReactionPostType,
  postId: number,
  next?: string | null,
) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Reaction[]>>(
    `/reactions/${postType}/${postId}/${requestPage ? `?page=${requestPage}/` : ''}`,
  );
  return data;
};