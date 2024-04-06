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

export interface ChatSocketData {
  content: string;
  userName: string;
  timestamp: string;
}

type SendChatSocketDataAction = 'message' | 'like' | 'remove_like';

export interface SendChatSocketData extends Omit<ChatSocketData, 'timestamp'> {
  userId: number;
  action: SendChatSocketDataAction;
}
