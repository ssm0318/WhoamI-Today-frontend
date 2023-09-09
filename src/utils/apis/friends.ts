import { PaginationResponse } from '@models/api/common';
import { GetFriendsTodayResponse } from '@models/api/friends';
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
