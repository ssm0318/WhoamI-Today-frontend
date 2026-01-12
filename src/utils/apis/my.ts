import { PaginationResponse } from '@models/api/common';
import { ResponseRequest } from '@models/api/question';
import { MyProfile } from '@models/api/user';
import { Note, Response } from '@models/post';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import axios, { axiosFormDataInstance } from './axios';

export const getMe = async () => {
  const { data } = await axios.get<MyProfile>('/user/me/');

  useBoundStore.getState().setMyProfile({ ...data, unread_noti_cnt: data.unread_noti_cnt ?? 0 });

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

// interest 목록
// TODO 실제 API 연동
export const searchInterests = async (query: string): Promise<string[]> => {
  // 가짜 데이터 - 실제 API 연동 전까지 사용
  const allInterests: string[] = [
    'Climbing',
    'Gym&lifting',
    'Cycling',
    'Sailing',
    'Tech&gadgets',
    'Music',
    'Dogs',
    'Cuisine',
    'Travel',
    'Photography',
    'Reading',
    'Cooking',
    'Art',
    'Sports',
    'Movies',
    'Gaming',
    'Pottery',
    'Yoga',
    'Hiking',
    'Dancing',
  ];

  // 검색어가 없으면 전체 목록 반환
  if (!query.trim()) {
    return Promise.resolve(allInterests);
  }

  // 검색어에서 # 제거
  const cleanQuery = query.replace(/^#+/, '').trim();

  // 검색어로 필터링
  const filtered = allInterests.filter((interest) =>
    interest.toLowerCase().includes(cleanQuery.toLowerCase()),
  );

  // 실제 API 호출을 시뮬레이션하기 위한 약간의 지연
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filtered);
    }, 200);
  });
};

// persona 목록
// TODO 실제 API 연동
export const searchPersonas = async (query: string): Promise<string[]> => {
  // 가짜 데이터 - 실제 API 연동 전까지 사용
  const allPersonas: string[] = [
    'Lurker',
    'ContentCreator',
    'PrivateReactor',
    'PublicCommenter',
    'InstantResponder',
    'TakesMyTime',
    'DailyScroller',
    'OccasionalChecker',
    'ScheduledChecker',
    'NightOwl',
    'EarlyBird',
    'EmojiFan',
    'WordPerson',
    'Poster',
    'Commenter',
    'SelfiePoster',
    'PhotoHeavy',
    'TextPoster',
    'DeepTalks',
    'CuriousAsker',
    'OpenBook',
    'ClosedBook',
    'NoFilterPurist',
    'CuratedAesthetic',
    'WeekendUser',
    'EverydayPresence',
    'TrendWatcher',
    'MemeLover',
    'FrequentPoster',
    'OccasionalPoster',
    'SharesManyAtOnce',
    'RandomAndCasual',
    'StreamOfConsciousness',
    'OneLiners',
    'Throwbacks',
    'MusicSharer',
    'OpinionPoster',
    'SilentSupporter',
    'AlwaysOnline',
    'RarelyPostsButWatchesEverything',
    'BingeScroller',
    'SilentObserver',
    'ActiveListener',
    'ThoughtfulResponder',
  ];

  // 검색어가 없으면 전체 목록 반환
  if (!query.trim()) {
    return Promise.resolve(allPersonas);
  }

  // 검색어에서 # 제거
  const cleanQuery = query.replace(/^#+/, '').trim();

  // 검색어로 필터링
  const filtered = allPersonas.filter((persona) =>
    persona.toLowerCase().includes(cleanQuery.toLowerCase()),
  );

  // 실제 API 호출을 시뮬레이션하기 위한 약간의 지연
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filtered);
    }, 200);
  });
};
