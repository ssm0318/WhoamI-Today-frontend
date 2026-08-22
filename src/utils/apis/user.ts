import { AxiosError, isAxiosError } from 'axios';
import { redirect } from 'react-router-dom';
import { SESSION_STORAGE_KEY } from '@constants/sessionStorageKey';
import { ScrollPositionStore } from '@hooks/useRestoreScrollPosition';
import i18n from '@i18n/index';
import { PaginationResponse } from '@models/api/common';
import { Connection } from '@models/api/friends';
import {
  EmailError,
  FriendRequest,
  InviterUsernameLookupResponse,
  PasswordConfirmError,
  PasswordError,
  SentFriendRequest,
  SignInError,
  SignInParams,
  SignInResponse,
  SignUpParams,
  UsernameError,
  VersionSwitchRequest,
  VersionSwitchRequestPendingResponse,
} from '@models/api/user';
import { AllPostFeedItem, NoteFeedItem, Response } from '@models/post';
import { User, UserProfile } from '@models/user';
import { VisibilityTier } from '@models/viewAs';
import { resetBoundStores } from '@stores/resetSlices';
import { useBoundStore } from '@stores/useBoundStore';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';
import { setItemToSessionStorage } from '@utils/sessionStorage';
import { getMe, syncTimeZone } from './my';
import { withViewAs } from './withViewAs';

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
        // NOTE: If access_token is expired or invalid, retry login once more
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

    // Redirect to password change page if password hasn't been changed
    if (!user.has_changed_pw) {
      redirect('/settings/reset-password?first_login=true');
      return user;
    }
    return user;
  } catch (e) {
    // 서버 다운(502/503) → 로그아웃하지 않고 maintenance 페이지로
    if (isAxiosError(e) && (e.response?.status === 502 || e.response?.status === 503)) {
      window.location.replace('/maintenance.html');
      return null;
    }

    resetBoundStores();
    setItemToSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY, {});

    // FIXME Change to existing /signin path when research is finished (uncomment below)
    // return redirect('/research-intro');
    return redirect('/signin');
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

export const signOut = async (onSuccess: () => void, registrationId?: string) => {
  axios.post('/user/logout/', { registration_id: registrationId ?? '' }).then(() => {
    onSuccess();
  });
};

export const validateBirthdate = ({
  birthdate,
  onSuccess,
  onError,
}: {
  birthdate: string;
  onSuccess: (res: { inviter_id: number }) => void;
  onError: (errorMsg: string) => void;
}) => {
  const formData = new FormData();
  formData.append('date_of_birth', birthdate);

  axiosFormDataInstance
    .post('/user/signup/birthdate/', formData)
    .then((res) => {
      onSuccess(res.data);
    })
    .catch((e) => {
      if (e.response.data.detail) {
        onError(e.response.data.detail);
      } else {
        onError(i18n.t('error.temporary_error'));
      }
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
    // Lowercase before submit so case-insensitive duplicate detection on the
    // backend keys off the canonical form, and so what we send matches what
    // the backend will persist.
    .post('/user/signup/email/', { email: email.toLowerCase() })
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
      if (e.response?.data.password_validation_error) {
        onError(i18n.t('sign_up.password_validation_error'));
      } else if (e.response?.data && 'error' in e.response.data) {
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
    // Same lowercasing rationale as the email precheck.
    .post('/user/signup/username/', { username: username.toLowerCase() })
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

export const validateInviterUsername = ({
  username,
  inviteCode,
  onSuccess,
  onError,
}: {
  username?: string;
  inviteCode?: string;
  onSuccess: (res: InviterUsernameLookupResponse) => void;
  onError: (errorMsg: string) => void;
}) => {
  const payload = inviteCode ? { invite_code: inviteCode } : { username };

  axiosFormDataInstance
    .post<InviterUsernameLookupResponse>('/user/signup/inviter-username/', payload)
    .then((res) => {
      onSuccess(res.data);
    })
    .catch((e) => {
      if (e.response?.data?.detail) {
        onError(e.response.data.detail);
      } else {
        onError(i18n.t('error.temporary_error'));
      }
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
    noti_time,
    inviter_id,
    date_of_birth,
    research_agreement,
    signature,
    date_of_signature,
  } = signUpInfo;

  // Lowercase email + username at submit so the stored value matches what we
  // ran the precheck against, and so the backend's case-insensitive uniqueness
  // check on /signup/ keys off the canonical form.
  formData.append('email', email.toLowerCase());
  formData.append('username', username.toLowerCase());
  formData.append('password', password);

  if (noti_time) formData.append('noti_time', noti_time);
  formData.append('inviter_id', String(inviter_id));
  if (date_of_birth) formData.append('date_of_birth', date_of_birth);
  formData.append('research_agreement', String(!!research_agreement));
  if (signature) formData.append('signature', signature);
  if (date_of_signature) formData.append('date_of_signature', date_of_signature);

  axiosFormDataInstance
    .post('/user/signup/', formData)
    .then(() => onSuccess())
    .catch((e) => {
      const errorData = e.response?.data;
      const errorMessage =
        errorData?.detail ||
        errorData?.inviter_id?.[0] ||
        errorData?.non_field_errors?.[0] ||
        i18n.t('error.temporary_error');
      onError(errorMessage);
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
// If id, token exist, request to reset-password/:id/:token/ (from password change email)
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

export const getUserProfile = async (
  username: string,
  viewAs?: VisibilityTier | null,
  viewAsUser?: string | null,
) => {
  const url = withViewAs(`/user/${encodeURIComponent(username)}/profile/`, { viewAs, viewAsUser });
  const { data } = await axios.get<UserProfile>(url);
  // Map friendship_level string to numeric connection_degree
  if (data.friendship_level && !data.connection_degree) {
    if (data.friendship_level === '2nd') {
      data.connection_degree = 2;
    } else if (data.friendship_level === '3rd+') {
      data.connection_degree = 3;
    }
    // '1st' = direct friend, no degree badge needed
  }
  return data;
};

export const getUserFriendList = async (username: string, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<User[]>>(
    `/user/${encodeURIComponent(username)}/friends/?type=all${
      requestPage ? `&page=${requestPage}` : ''
    }`,
  );
  return data;
};

export interface EvaluationParams {
  evaluation_closeness?: number;
  evaluation_relationship_type?: string;
  evaluation_relationship_type_detail?: string;
}

export const requestFriend = async ({
  userId,
  friendRequestType,
  updatePastPosts,
  evaluation,
  onSuccess,
  onError,
}: {
  userId: number;
  friendRequestType: Connection;
  updatePastPosts?: boolean;
  evaluation?: EvaluationParams;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  const currentUser = useBoundStore.getState().myProfile;
  if (!currentUser) return;

  await axios
    .post('/user/friend-requests/', {
      requester_id: currentUser.id,
      requestee_id: userId,
      requester_choice: friendRequestType,
      ...(updatePastPosts !== undefined &&
        friendRequestType === Connection.CLOSE_FRIEND && {
          requester_update_past_posts: updatePastPosts,
        }),
      ...evaluation,
    })
    .then(() => onSuccess())
    .catch((e: any) => {
      const { error } = e.response.data as { error: string[] };
      if (error) {
        if (error[0].includes('Cannot send friend requests to users using different versions')) {
          onError(i18n.t('error.friend_request_error_different_group'));
        } else {
          onError(error[0]);
        }
      } else {
        onError(i18n.t('error.temporary_error'));
      }
    });
};

export const cancelFriendRequest = async (userId: number) => {
  await axios.delete(`/user/friend-requests/${userId}/`);
};

export const acceptFriendRequest = async ({
  userId,
  friendType,
  updatePastPosts,
  evaluation,
  onSuccess,
  onError,
}: {
  userId: number;
  friendType: Connection;
  updatePastPosts?: boolean;
  evaluation?: EvaluationParams;
  onSuccess: () => void;
  onError: () => void;
}) => {
  await axios
    .patch(`/user/friend-requests/${userId}/respond/`, {
      accepted: true,
      requestee_choice: friendType,
      ...(updatePastPosts !== undefined &&
        friendType === Connection.CLOSE_FRIEND && {
          requestee_update_past_posts: updatePastPosts,
        }),
      ...evaluation,
    })
    .then(() => onSuccess())
    .catch(() => onError());
};

export const rejectFriendRequest = async ({
  userId,
  onSuccess,
  onError,
}: {
  userId: number;
  onSuccess: () => void;
  onError: () => void;
}) => {
  await axios
    .patch(`/user/friend-requests/${userId}/respond/`, {
      accepted: false,
    })
    .then(() => onSuccess())
    .catch(() => onError());
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
  const { data } = await axios.get<PaginationResponse<NoteFeedItem[]>>(
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

export const markAllFriendCheckInsAsRead = async () => {
  await axios.patch('/user/friends/mark-all-checkins-as-read/');
};

export const markAllFriendPostsAsRead = async () => {
  await axios.patch('/user/friends/mark-all-posts-as-read/');
};

/**
 *
 * @param username username
 * @returns PaginationResponse<AllPostFeedItem[]>
 */
export const getUserAllPosts = async (username: string) => {
  const { data } = await axios.get<PaginationResponse<AllPostFeedItem[]>>(
    `/user/${encodeURIComponent(username)}/all-posts/`,
  );
  return data;
};

export const requestVersionSwitch = async (reason?: string) => {
  const { data } = await axios.post<VersionSwitchRequest>('/user/version-switch-request/', {
    reason: reason ?? '',
  });
  return data;
};

export const getMyPendingVersionSwitchRequest = async () => {
  const { data } = await axios.get<VersionSwitchRequestPendingResponse>(
    '/user/version-switch-request/me/',
  );
  return data;
};
