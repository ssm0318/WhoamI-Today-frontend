import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { GetUpdatedProfileResponse, UpdatedProfile } from '@models/api/friends';

interface BreakFriendsParams {
  type: 'break_friends';
  item: UpdatedProfile;
}
interface UpdateFriendsStateParams {
  type: 'is_favorite' | 'is_hidden';
  item: UpdatedProfile;
  value: boolean;
}

export type UpdateFriendListParams = BreakFriendsParams | UpdateFriendsStateParams;

const useInfiniteFetchFriends = () => {
  const { targetRef, data, isLoading, mutate, isEndPage, isLoadingMore } =
    useSWRInfiniteScroll<UpdatedProfile>({ key: '/user/friends/?type=all' });

  const updateFriendList = (params: UpdateFriendListParams) => {
    if (!data) return;
    const {
      type,
      item: { id: userId },
    } = params;

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

    mutate(next, { revalidate: false });
  };

  return {
    isLoadingMoreAllFriends: isLoadingMore,
    targetRef,
    allFriends: data,
    isAllFriendsLoading: isLoading,
    isEndPage,
    updateFriendList,
    refetchAllFriends: mutate,
  };
};

export default useInfiniteFetchFriends;
