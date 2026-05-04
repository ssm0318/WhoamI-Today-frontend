import { PaginationResponse } from '@models/api/common';
import { Comment } from '@models/post';
import axios from './axios';
import { postComment } from './comments';

export interface AcknowledgmentResponse {
  acknowledged: boolean;
  count: number;
}

export interface AcknowledgmentUser {
  id: number;
  username: string;
  profile_image: string | null;
  profile_pic: string | null;
}

export const toggleAcknowledgment = async (entryId: number): Promise<AcknowledgmentResponse> => {
  const { data } = await axios.patch<AcknowledgmentResponse>(
    `/check_in/entries/${entryId}/acknowledge/`,
  );
  return data;
};

export const getAcknowledgments = async (entryId: number): Promise<AcknowledgmentUser[]> => {
  const { data } = await axios.get<AcknowledgmentUser[]>(
    `/check_in/entries/${entryId}/acknowledgments/`,
  );
  return data;
};

export const getPrivateComments = async (
  entryId: number,
): Promise<PaginationResponse<Comment[]>> => {
  const { data } = await axios.get<PaginationResponse<Comment[]>>(
    `/check_in/entries/${entryId}/private-comments/`,
  );
  return data;
};

export const postPrivateComment = async (entryId: number, content: string): Promise<Comment> => {
  const { data } = await postComment({
    target_type: 'CheckInComponentEntry',
    target_id: entryId,
    content,
    is_private: true,
  });
  return data as Comment;
};

export const postPrivateReply = async (
  parentCommentId: number,
  content: string,
): Promise<Comment> => {
  const { data } = await postComment({
    target_type: 'Comment',
    target_id: parentCommentId,
    content,
    is_private: true,
  });
  return data as Comment;
};
