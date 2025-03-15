import { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';
import { SESSION_STORAGE_KEY } from '@constants/sessionStorageKey';
import { ScrollPositionStore } from '@hooks/useRestoreScrollPosition';
import i18n from '@i18n/index';
import { PaginationResponse } from '@models/api/common';
import { Connection } from '@models/api/friends';
import {
  EmailError,
  FriendRequest,
  PasswordConfirmError,
  PasswordError,
  SentFriendRequest,
  SignInError,
  SignInParams,
  SignInResponse,
  SignUpParams,
  UsernameError,
} from '@models/api/user';
import { Note, Response } from '@models/post';
import { User, UserProfile } from '@models/user';
import { resetBoundStores } from '@stores/resetSlices';
import { useBoundStore } from '@stores/useBoundStore';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';
import { setItemToSessionStorage } from '@utils/sessionStorage';
import { getMe, syncTimeZone } from './my';

export const signIn = ({
  signInInfo,
  onSuccess,
  onError,
  retry = false,
}: {
  signInInfo: SignInParams;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
  retry?: boolean;
}) => {
  axios
    .post<SignInResponse>('/user/login/', signInInfo)
    .then(() => onSuccess())
    .catch((e: AxiosError<SignInError>) => {
      if (e.response?.status === 401 && !retry) {
        // NOTE: access_token이 만료되거나 잘못된 경우, 1번 더 다시 로그인 시도
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        signIn({ signInInfo, onSuccess, onError, retry: true });
        return;
      }
      if (e.response?.data.detail) {
        onError(e.response?.data.detail);
        return;
      }
      onError(i18n.t('error.temporary_error'));
    });
};

export const checkIfSignIn = async () => {
  try {
    const user = await getMe();
    const currentTimezone = await syncTimeZone(user?.timezone);
    useBoundStore.getState().setMyProfile({ ...user, timezone: currentTimezone });
    useBoundStore.getState().setFeatureFlags();
    return user;
  } catch {
    resetBoundStores();
    setItemToSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY, {});

    // FIXME 연구가 끝나면 기존 /signin 경로로 변경 (아래 주석 해제)
    return redirect('/research-intro');
    // return redirect('/signin');
  }
};

export const sendResetPasswordEmail = async ({
  email,
  onSuccess,
  onFail,
}: {
  email: string;
  onSuccess: () => void;
  onFail: (error: any) => void;
}) => {
  axios
    .post('/user/send-reset-password-email/', {
      email,
    })
    .then(onSuccess)
    .catch((e) => {
      onFail(e.response.data);
    });
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
      onError(i18n.t('error.temporary_error'));
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
      if (e.response?.data && 'error' in e.response.data) {
        const { error } = e.response.data as { error: { password?: string[] } };
        if (error?.password?.[0]) {
          onError(error.password[0]);
        } else {
          onError(String(e.response.data));
        }
      } else {
        onError(String(e.response?.data || e.message));
      }
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
      onError(i18n.t('error.temporary_error'));
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

  const { email, password, username, noti_time } = signUpInfo;

  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);

  if (noti_time) formData.append('noti_time', noti_time);

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

// reset password
// id, token이 있으면 reset-password/:id/:token/로 요청 (from 비밀번호 변경 이메일)
export const resetPassword = ({
  id,
  token,
  password,
  onSuccess,
  onError,
}: {
  id?: string;
  token?: string;
  password: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  const uid = id ? atob(id) : undefined;

  const url = uid ? `/user/reset-password/${uid}/` : `/user/reset-password/`;
  axios
    .put(url, { password, token })
    .then(() => onSuccess())
    .catch((e: AxiosError<PasswordError>) => {
      if (e.response?.data && 'error' in e.response.data) {
        const { error } = e.response.data as { error: { password?: string[] } };
        if (error?.password?.[0]) {
          onError(error.password[0]);
        } else {
          onError(String(e.response.data));
        }
      } else {
        onError(String(e.response?.data || e.message));
      }
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
  const { data } = await axios.get<UserProfile>(`/user/${encodeURIComponent(username)}/profile/`);
  return data;
};

// TODO: backend 작업 전
export const getUserFriendList = async (username: string, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<User[]>>(
    `/user/${encodeURIComponent(username)}/friends/?type=all${
      requestPage ? `&page=${requestPage}` : ''
    }`,
  );
  return data;
};

export const requestFriend = async ({
  userId,
  friendRequestType,
  updatePastPosts,
  onSuccess,
  onError,
  isDefault = false,
}: {
  userId: number;
  friendRequestType: Connection;
  updatePastPosts?: boolean;
  onSuccess: () => void;
  onError: () => void;
  isDefault?: boolean;
}) => {
  const currentUser = useBoundStore.getState().myProfile;
  if (!currentUser) return;

  if (isDefault) {
    axios
      .post('/user/friend-requests/default/', {
        requester_id: currentUser.id,
        requestee_id: userId,
      })
      .then(() => onSuccess())
      .catch(() => onError());
  } else {
    axios
      .post('/user/friend-requests/', {
        requester_id: currentUser.id,
        requestee_id: userId,
        requester_choice: friendRequestType,
        ...(updatePastPosts !== undefined &&
          friendRequestType === Connection.CLOSE_FRIEND && {
            requester_update_past_posts: updatePastPosts,
          }),
      })
      .then(() => onSuccess())
      .catch(() => onError());
  }
};

export const cancelFriendRequest = async (userId: number) => {
  await axios.delete(`/user/friend-requests/${userId}/`);
};

export const acceptFriendRequest = async ({
  userId,
  friendType,
  updatePastPosts,
  isDefault = false,
  onSuccess,
  onError,
}: {
  userId: number;
  friendType: Connection;
  updatePastPosts?: boolean;
  isDefault?: boolean;
  onSuccess: () => void;
  onError: () => void;
}) => {
  if (isDefault) {
    await axios
      .patch(`/user/friend-requests/${userId}/respond/default/`, {
        accepted: true,
      })
      .then(() => onSuccess())
      .catch(() => onError());
  } else {
    await axios
      .patch(`/user/friend-requests/${userId}/respond/`, {
        accepted: true,
        requestee_choice: friendType,
        ...(updatePastPosts !== undefined &&
          friendType === Connection.CLOSE_FRIEND && {
            requestee_update_past_posts: updatePastPosts,
          }),
      })
      .then(() => onSuccess())
      .catch(() => onError());
  }
};

export const rejectFriendRequest = async ({
  userId,
  isDefault = false,
  onSuccess,
  onError,
}: {
  userId: number;
  isDefault?: boolean;
  onSuccess: () => void;
  onError: () => void;
}) => {
  if (isDefault) {
    await axios
      .patch(`/user/friend-requests/${userId}/respond/default/`, { accepted: false })
      .then(() => onSuccess())
      .catch(() => onError());
  } else {
    await axios
      .patch(`/user/friend-requests/${userId}/respond/`, {
        accepted: false,
      })
      .then(() => onSuccess())
      .catch(() => onError());
  }
};

export const reportUser = async ({
  userId,
  onSuccess,
  onError,
}: {
  userId: number;
  onSuccess: () => void;
  onError: () => void;
}) => {
  await axios
    .post('/user_reports/', { reported_user_id: userId })
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onError();
    });
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

export const searchFriends = async (query: string, next?: string | null) => {
  const queryParams = next?.split('?')[1] || `query=${query}`;
  const { data } = await axios.get<PaginationResponse<UserProfile[]>>(
    `/user/me/search/?${queryParams}`,
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

export const getSentFriendRequests = async (next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<SentFriendRequest[]>>(
    `/user/friend-requests/sent/${requestPage ? `?page=${requestPage}` : ''}`,
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
    `/user/${encodeURIComponent(username)}/notes/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  if (data.results?.length) axios.patch('/user/mark-all-notes-as-read/', { username });
  return data;
};

export const readUserAllNotes = async (username: string) => {
  await axios.patch('/user/mark-all-notes-as-read/', { username });
};

// users responses
export const getUserResponses = async (username: string, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Response[]>>(
    `/user/${encodeURIComponent(username)}/responses/${requestPage ? `?page=${requestPage}` : ''}`,
  );

  if (data.results?.length) axios.patch('/user/mark-all-responses-as-read/', { username });

  return data;
};

export const readUserAllResponses = async (username: string) => {
  await axios.patch('/user/mark-all-responses-as-read/', { username });
};
