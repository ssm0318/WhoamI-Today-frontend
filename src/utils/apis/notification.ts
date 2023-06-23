import { GetNotificationsResponse } from '@models/api/notification';
import axios from './axios';

// GET notifications
export const getNotifications = async () => {
  const { data } = await axios.get<GetNotificationsResponse>(`/notifications/`);
  return data;
};
