import { Notification } from '@models/notification';

export const notificationList: Notification[] = Array.from({ length: 15 }, (_value, index) => ({
  id: index,
  redirect_url: `/my`,
  is_read: false,
  actor_detail: {
    username: `User`,
    profile_image: '',
    profile_pic: '',
    color_hex: '#FFFFFF',
  },
  message: `Notification ${index}`,
  is_response_request: false,
  question_content: 'Question',
  created_at: new Date().toISOString(),
}));
