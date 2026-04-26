import { PaginationResponse } from '@models/api/common';
import {
  CheckInPost,
  CheckInPostStory,
  CheckInPostVisibility,
  NewCheckInPostForm,
} from '@models/checkInPost';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';

export const getCheckInPostFeed = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<CheckInPost[]>>(
    `/check_in/posts/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getCheckInPostStories = async () => {
  const { data } = await axios.get<PaginationResponse<CheckInPostStory[]>>(
    '/check_in/posts/stories/',
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

export const postCheckInPost = async (form: NewCheckInPostForm) => {
  if (!form.image) {
    throw new Error('Image is required for check-in post.');
  }
  const formData = new FormData();
  formData.append('image', form.image.file);
  if (form.caption) formData.append('caption', form.caption);
  formData.append('visibility', form.closeFriendsOnly ? 'close_friends' : 'friends');

  const { data } = await axiosFormDataInstance.post<CheckInPost>('check_in/posts/', formData);
  return data;
};

export const deleteCheckInPost = async (postId: number) => {
  await axios.delete(`/check_in/posts/${postId}/`);
};

export const togglePinCheckInPost = async (postId: number) => {
  const { data } = await axios.patch<CheckInPost>(`/check_in/posts/${postId}/pin/`);
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
