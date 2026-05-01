import { User } from '@models/user';
import { CroppedImg } from '@utils/getCroppedImg';

export type CheckInPostVisibility = 'public' | 'friends' | 'close_friends';

export interface CheckInPost {
  id: number;
  type: 'CheckInPost';
  author_detail: User;
  image_url: string | null;
  caption: string;
  visibility: CheckInPostVisibility;
  is_pinned: boolean;
  pin_visibility: CheckInPostVisibility | null;
  created_at: string;
  like_count: number | null;
  current_user_like_id: number | null;
  comment_count: number;
  current_user_read?: boolean;
}

export interface CheckInPostStory {
  id: number;
  author_detail: User;
  image_url: string | null;
  caption: string;
  visibility: CheckInPostVisibility;
  is_pinned: boolean;
  pin_visibility: CheckInPostVisibility | null;
  created_at: string;
  current_user_read?: boolean;
  has_unread?: boolean;
  like_count?: number | null;
  comment_count?: number | null;
}

export interface NewCheckInPostForm {
  image: CroppedImg | null;
  caption: string;
  closeFriendsOnly: boolean;
}
