import useSWRInfinite from 'swr/infinite';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { GetUpdatedProfileResponse } from '@models/api/friends';
import { getAllFriends, getFriendsOptions } from '@utils/apis/friends';

interface BreakFriendsParams {
  type: 'break_friends';
  userId: number;
}
interface UpdateFriendsStateParams {
  type: 'is_favorite' | 'is_hidden';
  userId: number;
  value: boolean;
}

export type UpdateFriendListParams = BreakFriendsParams | UpdateFriendsStateParams;

const getKey = (pageIndex: number, previousPageData: GetUpdatedProfileResponse) => {
  if (previousPageData && !previousPageData.next) return null; // 끝에 도달
  return `/user/friends/?type=all&page=${pageIndex + 1}`; // SWR 키
};

const useInfiniteFetchFriends = (options?: getFriendsOptions) => {
  const { data, size, setSize, isLoading, mutate } = useSWRInfinite(getKey, (url) => {
    return getAllFriends({ filterHidden: options?.filterHidden, next: url });
  });
  const isEndPage = data && !data[size - 1]?.next;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const fetchAllFriends = () => {
    if (isEndPage) return;
    setSize((prevSize) => prevSize + 1);
  };

  const { targetRef } = useInfiniteScroll<HTMLDivElement>(() => {
    fetchAllFriends();
  });

  const updateFriendList = (params: UpdateFriendListParams) => {
    if (!data) return;
    const { type, userId } = params;

    let next: GetUpdatedProfileResponse[];
    if (type === 'break_friends') {
      next = data.map((prev) => {
        if (!prev.results) return prev;
        return {
          ...prev,
          results: prev.results.filter((user) => user.id !== userId),
        };
      });
    } else {
      next = data.map((prev) => {
        if (!prev.results) return prev;
        const selectedFriendIndex = prev.results.findIndex((user) => user.id === userId);
        if (selectedFriendIndex === -1) return prev;

        return {
          ...prev,
          results: [
            ...prev.results.slice(0, selectedFriendIndex),
            { ...prev.results[selectedFriendIndex], [type]: params.value },
            ...prev.results.slice(selectedFriendIndex + 1),
          ],
        };
      });
    }

    mutate(next);
  };

  return {
    isLoadingMoreAllFriends: isLoadingMore,
    targetRef,
    allFriends: data,
    isAllFriendsLoading: isLoading,
    isEndPage,
    updateFriendList,
  };
};

export default useInfiniteFetchFriends;
