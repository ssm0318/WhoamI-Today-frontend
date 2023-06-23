import { Notification } from '@models/notification';

// GET notifications
export interface GetNotificationsResponse {
  results: Notification[];
  nextUrl: string;
}
