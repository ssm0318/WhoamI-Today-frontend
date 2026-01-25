import { User } from '@models/user';

export interface PingRoomUser {
  id: number;
  username: string;
  profile_image?: string | null;
  url: string;
}

export interface PingRoom {
  id: number;
  user1: PingRoomUser;
  user2: PingRoomUser;
  last_ping_time: string;
  last_ping_content: string;
  last_ping_emoji: string;
  unread_cnt: number;
}

export interface InputPingMessage {
  emoji: PingEmojiType | '';
  content: string;
}

export interface PingMessage extends InputPingMessage {
  id: number;
  sender: Pick<User, 'id' | 'username' | 'url'>;
  is_read: boolean;
  created_at: string;
}

export interface PostPingMessageRes extends PingMessage {
  unread_count: number;
}

export interface RefinedPingMessage extends PingMessage {
  show_date?: boolean;
}

export enum PingEmojiType {
  WAVE = 'wave',
  SMILE = 'smile',
  HEART = 'heart',
  CRY = 'cry',
  LAUGH = 'laugh',
}

export const PingEmojiDict: { [key in PingEmojiType]: string } = {
  [PingEmojiType.WAVE]: '👋',
  [PingEmojiType.SMILE]: '😊',
  [PingEmojiType.HEART]: '❤️',
  [PingEmojiType.CRY]: '😭',
  [PingEmojiType.LAUGH]: '🤣',
};
