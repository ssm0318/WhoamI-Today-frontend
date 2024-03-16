import { Dispatch, SetStateAction } from 'react';
import { FetchState } from '@models/api/common';
import { GetUpdatedProfileResponse } from '@models/api/friends';

interface UpdateFriendListCommonParams {
  userId: number;
  setAllFriends: Dispatch<SetStateAction<FetchState<GetUpdatedProfileResponse>>>;
}

interface BreakFriendsParams extends UpdateFriendListCommonParams {
  type: 'break_friends';
}
interface UpdateFriendsStateParams extends UpdateFriendListCommonParams {
  type: 'is_favorite' | 'is_hidden';
  value: boolean;
}
/**
 * 클라이언트 state에 저장된 친구 리스트 업데이트
 */
const updateFriendsList = (params: UpdateFriendsStateParams | BreakFriendsParams) => {
  const { type, userId, setAllFriends } = params;

  if (type === 'break_friends') {
    setAllFriends((prev) => {
      if (!prev.data?.results) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          results: [...prev.data.results.filter((user) => user.id !== userId)],
        },
      };
    });
    return;
  }

  setAllFriends((prev) => {
    if (!prev.data?.results) return prev;
    const selectedFriendIndex = prev.data?.results?.findIndex((user) => user.id === userId);
    if (selectedFriendIndex === undefined) return prev;
    return {
      ...prev,
      data: {
        ...prev.data,
        results: [
          ...prev.data.results.slice(0, selectedFriendIndex),
          { ...prev.data.results[selectedFriendIndex], [type]: params.value },
          ...prev.data.results.slice(selectedFriendIndex + 1),
        ],
      },
    };
  });
};

export default updateFriendsList;
