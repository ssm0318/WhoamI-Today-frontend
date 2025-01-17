import { User } from '@models/user';

// NOTE: 임시 ping 메시지 타입. api 연결시에 응답값에 맞춰서 타입 수정 필요!
export interface PingMessage {
  id: number;
  sender: Pick<User, 'id' | 'username' | 'url'>;
  content: string;
  emoji: string;
  is_read: boolean;
  created_at: string;
}

export interface InputPingMessage {
  emoji: string;
  content: string;
}
