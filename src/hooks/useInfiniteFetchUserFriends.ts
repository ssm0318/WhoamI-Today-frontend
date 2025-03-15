import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { UpdatedProfile } from '@models/api/friends';

const useInfiniteFetchUserFriends = (username?: string) => {
  const { targetRef, data, isLoading, mutate, isEndPage, isLoadingMore } =
    useSWRInfiniteScroll<UpdatedProfile>({
      key: username ? `/user/${encodeURIComponent(username)}/friend-list/` : '',
    });

  if (!username) {
    return {
      isLoadingMoreAllFriends: false,
      targetRef: null,
      allFriends: [],
      isAllFriendsLoading: false,
      isEndPage: false,
      refetchAllFriends: () => {},
    };
  }

  return {
    isLoadingMoreAllFriends: isLoadingMore,
    targetRef,
    allFriends: data,
    isAllFriendsLoading: isLoading,
    isEndPage,
    refetchAllFriends: mutate,
  };
};

export default useInfiniteFetchUserFriends;
