import { User } from '@models/user';

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
