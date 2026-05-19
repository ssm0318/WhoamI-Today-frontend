import { UpdatedProfile } from '@models/api/friends';

type ReadFriendCheckIn = (checkInId: number) => Promise<unknown> | void;

let pendingReadTimer: ReturnType<typeof setTimeout> | null = null;

export function getUnreadFriendCheckInIds(friends: UpdatedProfile[]) {
  return friends.reduce<number[]>((ids, friend) => {
    if (!friend.check_in_id) return ids;

    const hasUnreadCheckIn =
      !friend.current_user_read_check_in ||
      !friend.current_user_read_battery ||
      !friend.current_user_read_mood ||
      !friend.current_user_read_song ||
      !friend.current_user_read_thought;

    if (hasUnreadCheckIn && !ids.includes(friend.check_in_id)) {
      ids.push(friend.check_in_id);
    }

    return ids;
  }, []);
}

export function cancelPendingFriendCheckInRead() {
  if (pendingReadTimer === null) return;
  clearTimeout(pendingReadTimer);
  pendingReadTimer = null;
}

export function scheduleFriendCheckInsRead(
  friends: UpdatedProfile[],
  readFriendCheckIn: ReadFriendCheckIn,
) {
  const unreadCheckInIds = getUnreadFriendCheckInIds(friends);
  if (unreadCheckInIds.length === 0) return;

  cancelPendingFriendCheckInRead();
  pendingReadTimer = setTimeout(() => {
    pendingReadTimer = null;
    unreadCheckInIds.forEach((checkInId) => {
      try {
        Promise.resolve(readFriendCheckIn(checkInId)).catch(() => undefined);
      } catch {
        // Leave-time read marking is best effort; the next visit can retry.
      }
    });
  }, 0);
}
