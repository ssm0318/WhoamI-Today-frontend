import { PaginationResponse } from '@models/api/common';
import { ResponseRequest } from '@models/api/question';
import { MyProfile } from '@models/api/user';
import { Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import axios, { axiosFormDataInstance } from './axios';

export const getMe = async () => {
  const { data } = await axios.get<MyProfile>('/user/me/');

  useBoundStore.getState().setMyProfile({ ...data, unread_noti_cnt: data.unread_noti_cnt ?? 0 });

  return data;
};

// get my profile
export const getMyProfile = async () => {
  const { data } = await axios.get<MyProfile>(`/user/me/profile/`);

  useBoundStore.getState().updateMyProfile({
    ...data,
  });
  return data;
};

// update my profile
export const editProfile = ({
  profile,
  onSuccess,
  onError,
}: {
  profile: Partial<
    Pick<
      MyProfile,
      | 'bio'
      | 'username'
      | 'pronouns'
      | 'noti_time'
      | 'noti_period_days'
      | 'user_personas'
      | 'user_interests'
    >
  > & {
    profile_image?: File;
  };
  onSuccess: (data: MyProfile) => void;
  onError?: (error: any) => void;
}) => {
  const formData = new FormData();

  Object.entries(profile).forEach(([key, value]) => {
    if (profile.profile_image && key === 'profile_image') {
      formData.append('profile_image', profile.profile_image, 'profile_image.png');
      return;
    }

    if (profile.noti_period_days && key === 'noti_period_days') {
      formData.append('noti_period_days', JSON.stringify(profile.noti_period_days));
      return;
    }

    // user_interests는 interests 키로, user_personas는 personas 키로 변환하여 공백으로 구분된 문자열로 전송
    if (key === 'user_interests' && Array.isArray(value)) {
      formData.append('interests', value.join(' '));
      return;
    }

    if (key === 'user_personas' && Array.isArray(value)) {
      formData.append('personas', value.join(' '));
      return;
    }

    // 다른 배열인 경우 JSON.stringify로 변환
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value as string);
  });

  axiosFormDataInstance
    .patch<MyProfile>('/user/me/', formData)
    .then((res) => onSuccess(res.data))
    .catch((e) => {
      onError?.(e.response.data);
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

export const getResponseRequests = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<ResponseRequest[]>>(
    `/user/me/response-requests/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const getMyAllPosts = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Response | Note[]>>(
    `/user/me/all-posts/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

// interest 목록 (API는 { count, next, previous, results: [...] } 페이지네이션 형태로 반환)
interface InterestItem {
  id: number;
  content: string;
}
type InterestListResponse = { results: InterestItem[] } | InterestItem[];

const toContentList = (data: InterestListResponse): string[] => {
  const items = Array.isArray(data) ? data : data?.results ?? [];
  return items.map((item) => item.content);
};

export const searchInterests = async (query: string): Promise<string[]> => {
  // 검색어가 없으면 recommendation API 호출
  if (!query.trim()) {
    try {
      const { data } = await axios.get<InterestListResponse>('/user/recommendations/interests/');
      return toContentList(data);
    } catch (error) {
      console.error('Failed to get interest recommendations:', error);
      return [];
    }
  }

  // 검색어에서 # 제거
  const cleanQuery = query.replace(/^#+/, '').trim();

  try {
    const { data } = await axios.get<InterestListResponse>('/user/interests/search/', {
      params: { q: cleanQuery },
    });
    return toContentList(data);
  } catch (error) {
    console.error('Failed to search interests:', error);
    return [];
  }
};

// persona 목록 (API는 { count, next, previous, results: [...] } 페이지네이션 형태로 반환)
interface PersonaItem {
  id: number;
  content: string;
}
type PersonaListResponse = { results: PersonaItem[] } | PersonaItem[];

const toPersonaContentList = (data: PersonaListResponse): string[] => {
  const items = Array.isArray(data) ? data : data?.results ?? [];
  return items.map((item) => item.content);
};

export const searchPersonas = async (query: string): Promise<string[]> => {
  // 검색어가 없으면 recommendation API 호출
  if (!query.trim()) {
    try {
      const { data } = await axios.get<PersonaListResponse>('/user/recommendations/personas/');
      return toPersonaContentList(data);
    } catch (error) {
      console.error('Failed to get persona recommendations:', error);
      return [];
    }
  }

  // 검색어에서 # 제거
  const cleanQuery = query.replace(/^#+/, '').trim();

  try {
    const { data } = await axios.get<PersonaListResponse>('/user/personas/search/', {
      params: { q: cleanQuery },
    });
    return toPersonaContentList(data);
  } catch (error) {
    console.error('Failed to search personas:', error);
    return [];
  }
};
