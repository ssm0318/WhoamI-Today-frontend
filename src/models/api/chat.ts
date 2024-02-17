import { User } from '@models/user';

export interface ChatRoom {
  id: number;
  participants: User[];
  last_message_content?: string; // prompt type의 경우에는?
  last_message_time?: string;
}

export interface ChatMessage {
  id: number;
  sender: User;
  content: string;
  timestamp: string;
}

export interface SocketMessage {
  message: string;
  userName: string;
  timestamp: string;
}

export interface SocketMessageInput extends Omit<SocketMessage, 'timestamp'> {
  userId: number;
}