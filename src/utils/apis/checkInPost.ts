import { PaginationResponse } from '@models/api/common';
import {
  CheckInPost,
  CheckInPostStory,
  CheckInPostVisibility,
  NewCheckInPostForm,
} from '@models/checkInPost';
import { Comment } from '@models/post';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';

export const getCheckInPostFeed = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<CheckInPost[]>>(
    `/check_in/posts/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getCheckInPostStories = async (
  visibility?: Extract<CheckInPostVisibility, 'public'>,
) => {
  const { data } = await axios.get<PaginationResponse<CheckInPostStory[]>>(
    '/check_in/posts/stories/',
    visibility ? { params: { visibility } } : undefined,
  );
  return data;
};

export const getUserCheckInPosts = async (userId: number) => {
  const { data } = await axios.get<PaginationResponse<CheckInPostStory[]>>(
    `/check_in/posts/by-user/${userId}/`,
  );
  return data;
};

export const getCheckInPost = async (postId: number) => {
  const { data } = await axios.get<CheckInPost>(`/check_in/posts/${postId}/`);
  return data;
};

export const postCheckInPost = async (
  form: NewCheckInPostForm,
  onUploadProgress?: (progress: number) => void,
  isPublic?: boolean,
) => {
  if (!form.image) {
    throw new Error('Image is required for check-in post.');
  }
  const formData = new FormData();
  formData.append('image', form.image.file);
  if (form.caption) formData.append('caption', form.caption);
  const defaultVisibility = isPublic ? 'public' : 'friends';
  formData.append('visibility', form.closeFriendsOnly ? 'close_friends' : defaultVisibility);

  const { data } = await axiosFormDataInstance.post<CheckInPost>('check_in/posts/', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(progress);
      }
    },
  });
  return data;
};

export const deleteCheckInPost = async (postId: number) => {
  await axios.delete(`/check_in/posts/${postId}/`);
};

export const togglePinCheckInPost = async (postId: number) => {
  const { data } = await axios.patch<CheckInPost>(`/check_in/posts/${postId}/pin/`);
  return data;
};

export const updateCheckInPostVisibility = async (
  postId: number,
  visibility: CheckInPostVisibility,
) => {
  const { data } = await axios.patch<CheckInPost>(`/check_in/posts/${postId}/visibility/`, {
    visibility,
  });
  return data;
};

export const updateCheckInPostPinVisibility = async (
  postId: number,
  pinVisibility: CheckInPostVisibility,
) => {
  const { data } = await axios.patch<CheckInPost>(`/check_in/posts/${postId}/pin_visibility/`, {
    pin_visibility: pinVisibility,
  });
  return data;
};

export const readCheckInPosts = async (ids: number[]) => {
  await axios.patch('/check_in/posts/read/', { ids });
};

export interface CheckInPostLike {
  id: number;
  user_detail: { id: number; username: string; profile_image: string | null };
}

export const getCheckInPostLikes = async (postId: number) => {
  const { data } = await axios.get<PaginationResponse<CheckInPostLike[]>>(
    `/check_in/posts/${postId}/likes/`,
  );
  return data;
};

export const getCheckInPostComments = async (postId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Comment[]>>(
    `/check_in/posts/${postId}/comments/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};
