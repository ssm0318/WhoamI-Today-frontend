import { PaginationResponse } from '@models/api/common';
import { Notification } from '@models/notification';
import axios from './axios';

// GET notifications
export const getNotifications = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Notification[]>>(
    `/notifications/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
