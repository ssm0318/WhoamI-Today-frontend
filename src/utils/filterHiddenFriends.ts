import { UpdatedProfile } from '@models/api/friends';

export const filterHiddenFriends = (friends: UpdatedProfile[]) =>
  friends.filter(({ is_hidden }) => !is_hidden);
