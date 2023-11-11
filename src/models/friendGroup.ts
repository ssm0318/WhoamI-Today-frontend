import { User } from './user';

export interface FriendGroup {
  id: number;
  name: string;
  order: number;
  friends: User[];
}
