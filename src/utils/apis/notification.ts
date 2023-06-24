import { PaginationResponse } from '@models/api/common';
import axios from './axios';

// GET notifications
export const getNotifications = async () => {
  const { data } = await axios.get<PaginationResponse<Notification[]>>(`/notifications/`);
  return data;
};
