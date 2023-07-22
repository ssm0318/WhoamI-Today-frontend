import { GetFriendsTodayResponse } from '@models/api/friends';
import axios from '@utils/apis/axios';
import { getDateRequestParams } from './common';

export const getFriendsToday = async () => {
  const { year, month, day } = getDateRequestParams(new Date());
  const { data } = await axios.get<GetFriendsTodayResponse>(
    `/user/friends/${year}/${month}/${day}/`,
  );
  return data;
};
