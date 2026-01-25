import { User } from '@models/user';

/** API /ping/rooms/ 응답의 opponent */
export interface PingRoomOpponent {
  id: number;
  profile_image?: string | null;
  profile_pic?: string;
  url: string;
  username: string;
  unread_count: number;
}

/** API /ping/rooms/ 응답의 room 항목 */
export interface PingRoom {
  id: number;
  last_message: string;
  last_message_time: string;
  opponent: PingRoomOpponent;
  /** 이모지(선택) - API에 없을 수 있음 */
  last_ping_emoji?: string;
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
