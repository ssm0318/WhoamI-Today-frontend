import { User } from '@models/user';

export interface ChatRoomOpponent {
  id: number;
  profile_image?: string | null;
  profile_pic?: string;
  url: string;
  username: string;
  unread_count: number;
  is_close_friend?: boolean;
}

export interface ChatRoomMember {
  id: number;
  username: string;
  url: string;
  profile_image?: string | null;
  is_close_friend?: boolean;
}

export interface ChatRoom {
  id: number;
  is_group: boolean;
  name: string;
  last_message: string;
  last_message_time: string;
  opponent: ChatRoomOpponent | null;
  members_detail: ChatRoomMember[] | null;
  unread_count: number;
}

export interface InputChatMessage {
  emoji: ChatEmojiType | '' | null;
  content: string;
  parent?: number;
  shared_content_type?: string;
  shared_object_id?: number;
}

export interface MessageReactionSummary {
  emoji: string;
  count: number;
  my_reaction_id: number | null;
}

export interface MessageParentPreview {
  id: number;
  content: string | null;
  emoji: string | null;
  sender: Pick<User, 'id' | 'username' | 'url'>;
}

export interface SharedContentPreview {
  type: string; // 'note', 'response', 'question', etc.
  id: number;
  content?: string;
  title?: string;
  author?: Pick<User, 'id' | 'username' | 'url'>;
  image_url?: string;
}

export type ChatEventType = '' | 'member_added' | 'member_left';

export interface ChatMessage extends Omit<InputChatMessage, 'parent'> {
  id: number;
  sender: Pick<User, 'id' | 'username' | 'url'>;
  image: string | null;
  is_read: boolean;
  created_at: string;
  parent: number | null;
  reactions: MessageReactionSummary[];
  parent_preview: MessageParentPreview | null;
  shared_content_preview: SharedContentPreview | null;
  event_type?: ChatEventType;
  event_target_users?: ChatRoomMember[];
}

export interface PostChatMessageRes extends ChatMessage {
  unread_count: number;
}

export interface RefinedChatMessage extends ChatMessage {
  show_date?: boolean;
}

export enum ChatEmojiType {
  WAVE = 'wave',
  SMILE = 'smile',
  HEART = 'heart',
  CRY = 'cry',
  LAUGH = 'laugh',
}

export const ChatEmojiDict: { [key in ChatEmojiType]: string } = {
  [ChatEmojiType.WAVE]: '👋',
  [ChatEmojiType.SMILE]: '😊',
  [ChatEmojiType.HEART]: '❤️',
  [ChatEmojiType.CRY]: '😭',
  [ChatEmojiType.LAUGH]: '🤣',
};
