import { PaginationResponse } from '@models/api/common';
import { MyProfile } from '@models/api/user';
import { Note, Response } from '@models/post';
import { UserProfile } from '@models/user';
import axios, { axiosFormDataInstance } from './axios';

export const getMe = async () => {
  const { data } = await axios.get<MyProfile>('/user/me/');
  return data;
};

// get my profile
export const getMyProfile = async () => {
  const { data } = await axios.get<UserProfile>(`/user/me/profile/`);
  return data;
};

// update my profile
export const editProfile = ({
  profile,
  onSuccess,
  onError,
}: {
  profile: Pick<MyProfile, 'bio' | 'username' | 'pronouns'> & { profile_image?: File };
  onSuccess: (data: MyProfile) => void;
  onError?: (error: string) => void;
}) => {
  const formData = new FormData();

  Object.entries(profile).forEach(([key, value]) => {
    if (profile.profile_image && key === 'profile_image') {
      formData.append('profile_image', profile.profile_image, 'profile_image.png');
      return;
    }
    if (value) {
      formData.append(key, value as string);
    }
  });

  axiosFormDataInstance
    .patch<MyProfile>('/user/me/', formData)
    .then((res) => onSuccess(res.data))
    .catch((e) => {
      onError?.(e);
    });
};

// sync timezone
export const syncTimeZone = async (timezone?: string) => {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (currentTimezone === timezone) return;

  const formData = new FormData();

  formData.append('timezone', currentTimezone);

  await axiosFormDataInstance.patch('/user/me/', formData);

  return currentTimezone;
};

// delete me
export const deleteAccount = async (onSuccess: () => void) => {
  axios
    .delete('/user/me/delete')
    .then(() => onSuccess())
    // TODO
    .catch((e) => console.log('todo', e));
};

export const getMyResponses = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Response[]>>(
    `/user/me/responses/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const getMyNotes = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Note[]>>(
    `/user/me/notes/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
