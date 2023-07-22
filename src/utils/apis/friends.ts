import { GetFriendsTodayResponse } from '@models/api/friends';
import axios from '@utils/apis/axios';

export const getFriendsToday = async () => {
  const { data } = await axios.get<GetFriendsTodayResponse>('/user/friends/2023/7/22/');
  return data;
};
