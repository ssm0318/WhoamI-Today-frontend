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

export type BotButtonAction = 'reply' | 'navigate' | 'upload' | 'external';

export interface BotButton {
  label: string;
  action: BotButtonAction;
  payload?: string; // for action: 'reply'
  url?: string; // for action: 'navigate' | 'external'
  context?: string; // for action: 'upload'
}

export interface BotMultiSelectOption {
  label: string;
  value: string;
}

// Discriminated union covering every bot_payload variant the backend emits or
// the frontend posts back. Keep in sync with chat/wit_bot_payloads.py.
export type BotPayload =
  | {
      kind: 'card';
      buttons?: BotButton[];
      intro?: string;
    }
  | {
      kind: 'choice';
      payload?: string;
    }
  | {
      kind: 'upload';
      context?: string;
      label?: string;
    }
  | {
      kind: 'multi_select';
      intent: string;
      options: BotMultiSelectOption[];
      submit_label: string;
      min_selection: number;
      max_selection: number | null;
    }
  | {
      kind: 'multi_select_response';
      intent: string;
      selected: string[];
    }
  | {
      kind: 'upload_response';
      context?: string;
    };

export interface InputChatMessage {
  emoji: ChatEmojiType | '' | null;
  content: string;
  parent?: number;
  shared_content_type?: string;
  shared_object_id?: number;
  bot_payload?: BotPayload | null;
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
  chat_room_id: number;
  sender: Pick<User, 'id' | 'username' | 'url' | 'profile_pic' | 'profile_image'>;
  image: string | null;
  is_read: boolean;
  created_at: string;
  parent: number | null;
  reactions: MessageReactionSummary[];
  parent_preview: MessageParentPreview | null;
  shared_content_preview: SharedContentPreview | null;
  event_type?: ChatEventType;
  event_target_users?: ChatRoomMember[];
  bot_payload?: BotPayload | null;
}

export interface PostChatMessageRes extends ChatMessage {
  unread_count: number;
  /**
   * For wit_bot 1-on-1 rooms only: the bot's reply messages created
   * synchronously by the engine inside the same POST. Backend ships them
   * inline so the client doesn't have to wait for a WebSocket hop.
   */
  bot_replies?: ChatMessage[];
}

export interface RefinedChatMessage extends ChatMessage {
  show_date?: boolean;
  is_first_in_cluster?: boolean;
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
