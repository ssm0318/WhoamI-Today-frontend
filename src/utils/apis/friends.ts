import { PaginationResponse } from '@models/api/common';
import { GetFriendsTodayResponse, GetUpdatedProfileResponse } from '@models/api/friends';
import axios from '@utils/apis/axios';

export const getFriendsToday = async () => {
  const { data } = await axios.get<PaginationResponse<GetFriendsTodayResponse>>(
    `/user/friends/today/`,
  );
  return data;
};

export const getFriendToday = async (userId: number) => {
  const {
    data: { results },
  } = await axios.get<PaginationResponse<GetFriendsTodayResponse>>(`/user/friend/${userId}/today/`);

  return results ?? [];
};

export const getUpdatedProfiles = async () => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/me/friends/updated/');

  return results ?? [];
};

export const getAllFriends = async () => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/me/friends/all/');

  return results ?? [];
};

export const addFriendToFavorite = async (userId: number) => {
  await axios.post(`/user/favorite/add/`, {
    friend_id: userId,
  });
};

export const getFavoriteFriends = async () => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/me/favorites/');

  return results ?? [];
};
