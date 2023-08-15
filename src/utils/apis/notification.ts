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

// PATCH notification/read (노티 읽음 처리)
export const readNotification = async (ids: number[]) => {
  const { data } = await axios.patch<Notification[]>(`/notifications/read/`, {
    ids,
  });
  return data;
};

// POST activate device (노티 설정)
export const activateFirebaseNotification = async ({
  token,
  active,
}: {
  token: string;
  active: boolean;
}) => {
  await axios.post(`/devices/`, {
    type: 'web',
    registration_id: token,
    active,
  });
};
