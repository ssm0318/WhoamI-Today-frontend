import { PaginationResponse } from '@models/api/common';
import { GetFriendsTodayResponse, GetUpdatedProfileResponse } from '@models/api/friends';
import axios from '@utils/apis/axios';
import { filterHiddenFriends } from '@utils/filterHiddenFriends';

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

interface getFriendsOptions {
  filterHidden?: boolean;
}

export const getUpdatedProfiles = async (options?: getFriendsOptions) => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/friends/?type=has_updates');

  return options?.filterHidden ? filterHiddenFriends(results ?? []) : results ?? [];
};

export const getAllFriends = async (options?: getFriendsOptions) => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/friends/?type=all');

  return options?.filterHidden ? filterHiddenFriends(results ?? []) : results ?? [];
};

export const addFriendToFavorite = async (userId: number) => {
  await axios.post(`/user/friends/favorites/`, {
    friend_id: userId,
  });
};

export const getFavoriteFriends = async () => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/friends/?type=favorites');

  return results ?? [];
};

export const deleteFavorite = async (userId: number) => {
  await axios.delete(`/user/friends/${userId}/favorites/ `);
};

export const hideFriend = async (userId: number) => {
  await axios.post(`/user/friends/hidden/`, {
    friend_id: userId,
  });
};
