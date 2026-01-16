import { PaginationResponse } from '@models/api/common';
import { Note, Response } from '@models/post';
import axios from './axios';

export interface PinResponse {
  id: number;
  content_type: 'Note' | 'Response';
  object_id: number;
}

/**
 * Pin a post
 * @param postType - Type of post ('Note' or 'Response')
 * @param postId - ID of the post to pin
 */
export const pinPost = async (postType: 'Note' | 'Response', postId: number) => {
  const { data } = await axios.post<PinResponse>('/pins/', {
    content_type: postType,
    object_id: postId,
  });
  return data;
};

/**
 * Unpin a post
 * @param pinId - ID of the pin to unpin
 */
export const unpinPost = async (pinId: number) => {
  await axios.delete(`/pins/${pinId}/`);
};

/**
 * Get pinned posts for a user
 * @param username - Username to get pinned posts for. If not provided, gets current user's pinned posts
 * @param page - Page number for pagination
 */
export const getPinnedPosts = async (username?: string, page?: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const endpoint = username ? `/pins/users/${encodeURIComponent(username)}/` : '/pins/me/';
  const { data } = await axios.get<PaginationResponse<Note[] | Response[]>>(
    `${endpoint}${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
