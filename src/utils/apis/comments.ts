import { CommonTarget, PaginationResponse } from '@models/api/common';
import { Like } from '@models/post';
import axios from './axios';

interface PostCommentProps extends CommonTarget {
  content: string;
  // is_private: boolean;
}

export const postComment = async (postInfo: PostCommentProps) => {
  return axios.post(`/comments/`, postInfo);
};

export const deleteComment = async (commentId: number) => {
  return axios.delete(`/comments/${commentId}/`);
};

export const getCommentLikes = async (commentId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Like[]>>(
    `/comments/${commentId}/likes/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
