import { CheckInBase, SocialBattery } from '@models/checkIn';
import { DayQuestion, Note, Response } from '@models/post';
import { User } from '@models/user';
import { PaginationResponse } from './common';
import { GetMomentResponse } from './moment';

export type GetFriendsTodayResponse = FriendToday[];

export interface FriendToday extends User {
  moments?: GetMomentResponse[];
  questions?: DayQuestion[];
  check_in?: CheckInBase;
}

export type GetUpdatedProfileResponse = PaginationResponse<UpdatedProfile[]>;

export interface UpdatedProfile extends User {
  is_favorite: boolean;
  is_check_in_subscribed?: boolean;
  is_subscribed?: boolean;
  is_hidden: boolean;
  current_user_read: boolean;
  current_user_read_check_in: boolean;
  unread_cnt: number;
  check_in_id?: number | null;
  track_id?: string;
  description: string;
  mood?: string;
  unread_chat_count: number;
  unread_post_cnt?: number;
  recent_posts?: (Note | Response)[];
  social_battery?: SocialBattery | null;
  sent_pokes?: Partial<Record<'battery' | 'mood' | 'thought' | 'song', number>>;
  /** Viewer-visible pinned archive entries for this friend. 0 when none. */
  pinned_count?: number;
  /** Check-in components updated in the last 24h (e.g. ['mood', 'song']). */
  recently_updated_check_in?: ('battery' | 'mood' | 'thought' | 'song')[];
  battery_updated_at?: string | null;
  mood_updated_at?: string | null;
  song_updated_at?: string | null;
  thought_updated_at?: string | null;
}

export type GetAllFriendsResponse = PaginationResponse<UpdatedProfile[]>;
export type GetFavoriteFriendsResponse = PaginationResponse<UpdatedProfile[]>;

export enum Connection {
  FRIEND = 'friend',
  CLOSE_FRIEND = 'close_friend',
}

export type FriendType = 'all' | 'close_friends' | 'check_in_updates';
