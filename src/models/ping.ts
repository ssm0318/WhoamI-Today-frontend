import { User } from '@models/user';

export interface InputPingMessage {
  emoji: string;
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
