import { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';
import i18n from '@i18n/index';
import { PaginationResponse } from '@models/api/common';
import {
  EmailError,
  FriendRequest,
  PasswordConfirmError,
  PasswordError,
  SignInError,
  SignInParams,
  SignInResponse,
  SignUpParams,
  UsernameError,
} from '@models/api/user';
import { Note } from '@models/note';
import { Response } from '@models/post';
import { User, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';
import { getMe, syncTimeZone } from './my';

export const signIn = ({
  signInInfo,
  onSuccess,
  onError,
}: {
  signInInfo: SignInParams;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axios
    .post<SignInResponse>('/user/login/', signInInfo)
    .then(() => onSuccess())
    .catch((e: AxiosError<SignInError>) => {
      if (e.response?.data.detail) {
        onError(e.response?.data.detail);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const checkIfSignIn = async () => {
  try {
    const user = await getMe();
    const currentTimezone = await syncTimeZone(user?.timezone);
    useBoundStore.getState().setMyProfile({ ...user, timezone: currentTimezone });
    return user;
  } catch {
    return redirect('/signin');
  }
};

export const signOut = async (onSuccess: () => void) => {
  axios.get('/user/logout/').then(() => {
    onSuccess();
  });
};

export const validateEmail = ({
  email,
  onSuccess,
  onError,
}: {
  email: string;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axiosFormDataInstance
    .post('/user/signup/email/', { email })
    .then(() => {
      onSuccess();
    })
    .catch((e: AxiosError<EmailError>) => {
      if (e.response?.data.detail) {
        onError(e.response.data.detail);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const validatePassword = ({
  password,
  onSuccess,
  onError,
}: {
  password: string;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axiosFormDataInstance
    .post('/user/signup/password/', { password })
    .then(() => {
      onSuccess();
    })
    .catch((e: AxiosError<PasswordError>) => {
      if (e.response?.data.password[0]) {
        onError(e.response.data.password[0]);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const validateUsername = ({
  username,
  onSuccess,
  onError,
}: {
  username: string;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axiosFormDataInstance
    .post('/user/signup/username/', { username })
    .then(() => {
      onSuccess();
    })
    .catch((e: AxiosError<UsernameError>) => {
      if (e.response?.data.detail) {
        onError(e.response.data.detail);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const signUp = ({
  signUpInfo,
  onSuccess,
  onError,
}: {
  signUpInfo: SignUpParams;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  const formData = new FormData();

  const {
    email,
    password,
    username,
    profileImage,
    research_agreement,
    age,
    gender,
    signature,
    date_of_signature,
    noti_time,
  } = signUpInfo;

  if (profileImage) {
    formData.append('profile_image', profileImage, 'profile_image.png');
  }
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);

  if (noti_time) formData.append('noti_time', noti_time);

  if (research_agreement) {
    formData.append('research_agreement', `${research_agreement}`);
    if (age) formData.append('age', `${age}`);
    if (gender) formData.append('gender', `${gender}`);
    if (signature) formData.append('signature', `${signature}`);
    if (date_of_signature) formData.append('date_of_signature', `${date_of_signature}`);
  }

  axiosFormDataInstance
    .post('/user/signup/', formData)
    .then(() => onSuccess())
    .catch((e) => {
      onError(e);
    });
};

export const confirmPassword = ({
  password,
  onSuccess,
  onError,
}: {
  password: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}) => {
  axios
    .post('/user/password-confirm/', { password })
    .then(() => onSuccess())
    .catch((e: AxiosError<PasswordConfirmError>) => {
      if (e.response?.data.detail) {
        onError?.(e.response?.data.detail);
      }
    });
};

export const resetPassword = ({
  userId,
  password,
  onSuccess,
  onError,
}: {
  userId: number;
  password: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  axios
    .put(`/user/reset-password/${userId}/`, { password })
    .then(() => onSuccess())
    .catch((e: AxiosError<PasswordError>) => {
      if (e.response?.data.password[0]) {
        onError(e.response.data.password[0]);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const getFriendList = async (next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<User[]>>(
    `/user/friends/?type=all${requestPage ? `&page=${requestPage}` : ''}`,
  );
  return data;
};

export const getUserProfile = async (username: string) => {
  const { data } = await axios.get<UserProfile>(`/user/${username}/profile/`);
  return data;
};

export const requestFriend = async (userId: number) => {
  const currentUser = useBoundStore.getState().myProfile;
  if (!currentUser) return;

  await axios.post('/user/friend-requests/', {
    requester_id: currentUser.id,
    requestee_id: userId,
  });
};

export const cancelFriendRequest = async (userId: number) => {
  await axios.delete(`/user/friend-requests/${userId}/`);
};

export const acceptFriendRequest = async (userId: number) => {
  await axios.patch(`/user/friend-requests/${userId}/respond/`, { accepted: true });
};

export const rejectFriendRequest = async (userId: number) => {
  await axios.patch(`/user/friend-requests/${userId}/respond/`, { accepted: false });
};

export const reportUser = async (userId: number) => {
  await axios.post('/user_reports/', { reported_user_id: userId });
};

export const breakFriend = async (friendId: number) => {
  await axios.delete(`/user/friends/${friendId}/`);
};

export const searchUser = async (query: string, next?: string | null) => {
  const queryParams = next?.split('?')[1] || `query=${query}`;
  const { data } = await axios.get<PaginationResponse<UserProfile[]>>(
    `/user/search/?${queryParams}`,
  );
  return data;
};

export const getFriendRequests = async (next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<FriendRequest[]>>(
    `/user/friend-requests/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getRecommendedFriends = async () => {
  const { data } = await axios.get<User[]>('/user/recommended-friends/');
  return data;
};

export const blockRecommendation = async (userId: number) => {
  return axios.post('/user/block-recommendation/', { blocked_user_id: userId });
};

// users notes
export const getUserNotes = async (username: string, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Note[]>>(
    `/user/${username}/notes/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

// users responses
export const getUserResponses = async (username: string, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Response[]>>(
    `/user/${username}/responses/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};
