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

// export interface ChatSocketData {
//   content: string;
//   userName: string;
//   timestamp: string;
// }

export interface RequestMessageAction {
  action: 'message';
  userId: number;
  userName: string;
  content: string;
}
export interface ResponseMessageAction extends Omit<RequestMessageAction, 'action' | 'userId'> {
  timestamp: string;
}

export interface RequestLikeAction {
  action: 'like';
  messageId: number;
}
export interface ResponseLikeAction extends RequestLikeAction {
  messageLikeCnt: number;
  currentUserMessageLikeId: number;
}

export interface RequestRemoveLikeAction {
  action: 'remove_like';
  messageLikeId: number;
}
export type ResponseRemoveLikeAction = ResponseLikeAction;

export type SendChatRoomSocketData =
  | RequestMessageAction
  | RequestLikeAction
  | RequestRemoveLikeAction;
