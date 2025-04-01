import { ActorDetail } from './post';

export interface Notification {
  id: number;
  created_at: string;
  redirect_url: string;
  is_read: boolean;
  message: string;
  is_response_request: boolean;
  is_friend_request: boolean;
  is_recent: boolean;
  question_content: string;
  notification_type: NotificationType;
  recent_actors: ActorDetail[];
}

export type NotificationType =
  | 'FriendRequest'
  | 'ResponseRequest'
  | 'Like'
  | 'Comment'
  | 'Response'
  | 'Ping'
  | 'User'
  | 'DailySurvey'
  | 'other';
