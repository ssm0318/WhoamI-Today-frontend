import { Dispatch, SetStateAction } from 'react';
import { FetchState } from '@models/api/common';
import { GetUpdatedProfileResponse } from '@models/api/friends';

type UpdateFriendsType = 'is_favorite' | 'is_hidden';
/**
 * 클라이언트 state에 저장된 친구 리스트 업데이트
 */
const updateFriendsList = ({
  userId,
  type,
  value,
  setAllFriends,
}: {
  userId: number;
  type: UpdateFriendsType;
  value: boolean;
  setAllFriends: Dispatch<SetStateAction<FetchState<GetUpdatedProfileResponse>>>;
}) => {
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
          { ...prev.data.results[selectedFriendIndex], [type]: value },
          ...prev.data.results.slice(selectedFriendIndex + 1),
        ],
      },
    };
  });
};

export default updateFriendsList;
