import { CommonTarget } from '@models/api/common';
import axios from './axios';

interface PostLikeResponse extends CommonTarget {
  id: number;
  type: 'Like';
  user: string;
  user_detail: { id: number; username: string };
  is_anonymous: boolean;
}

export const postLike = async (targetInfo: CommonTarget) => {
  const { data } = await axios.post<PostLikeResponse>(`/likes/`, targetInfo);
  return data;
};

export const deleteLike = async (likeId: number) => {
  return axios.delete(`/likes/${likeId}/`);
};
