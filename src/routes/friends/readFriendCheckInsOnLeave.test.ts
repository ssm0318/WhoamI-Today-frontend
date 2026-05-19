/* eslint-env jest */

import { UpdatedProfile } from '@models/api/friends';
import {
  cancelPendingFriendCheckInRead,
  getUnreadFriendCheckInIds,
  scheduleFriendCheckInsRead,
} from './readFriendCheckInsOnLeave';

const friend = (overrides: Partial<UpdatedProfile>): UpdatedProfile =>
  ({
    id: overrides.id ?? 1,
    username: overrides.username ?? 'friend',
    profile_image: null,
    is_favorite: false,
    is_hidden: false,
    current_user_read: true,
    current_user_read_check_in: true,
    current_user_read_battery: true,
    current_user_read_mood: true,
    current_user_read_song: true,
    current_user_read_thought: true,
    unread_cnt: 0,
    unread_chat_count: 0,
    check_in_id: 10,
    description: '',
    ...overrides,
  } as UpdatedProfile);

describe('readFriendCheckInsOnLeave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    cancelPendingFriendCheckInRead();
  });

  afterEach(() => {
    cancelPendingFriendCheckInRead();
    jest.useRealTimers();
  });

  it('marks friends unread by per-component UP flags even when the legacy check-in flag is read', () => {
    const ids = getUnreadFriendCheckInIds([
      friend({ id: 1, check_in_id: 101, current_user_read_check_in: true }),
      friend({ id: 2, check_in_id: 102, current_user_read_song: false }),
      friend({ id: 3, check_in_id: 103, current_user_read_mood: false }),
    ]);

    expect(ids).toEqual([102, 103]);
  });

  it('defers leave-time read calls so an immediate remount can cancel them', () => {
    const readFriendCheckIn = jest.fn();

    scheduleFriendCheckInsRead(
      [friend({ id: 1, check_in_id: 201, current_user_read_battery: false })],
      readFriendCheckIn,
    );
    cancelPendingFriendCheckInRead();
    jest.runOnlyPendingTimers();

    expect(readFriendCheckIn).not.toHaveBeenCalled();
  });

  it('reads unread check-ins when the leave timer is not cancelled', () => {
    const readFriendCheckIn = jest.fn();

    scheduleFriendCheckInsRead(
      [friend({ id: 1, check_in_id: 301, current_user_read_thought: false })],
      readFriendCheckIn,
    );
    jest.runOnlyPendingTimers();

    expect(readFriendCheckIn).toHaveBeenCalledWith(301);
  });
});
