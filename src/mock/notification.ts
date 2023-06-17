import { Notification } from '@models/notification';

export const notification: Notification = {
  id: 1,
  redirect_url: `/home`,
  is_read: false,
  actor_detail: {
    username: `User`,
    profile_image: '',
    profile_pic: '',
    color_hex: '#FFFFFF',
  },
  message: `Notification`,
  is_response_request: false,
  question_content: 'Question',
  created_at: new Date().toISOString(),
};
