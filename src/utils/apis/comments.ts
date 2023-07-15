import { CommonTarget } from '@models/api/common';
import axios from './axios';

interface PostCommentProps extends CommonTarget {
  content: string;
}

export const postComment = async (postInfo: PostCommentProps) => {
  return axios.post(`/comments/`, postInfo);
};
