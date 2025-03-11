import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { UpdatedProfile } from '@models/api/friends';

const useInfiniteFetchUserFriends = (username: string) => {
  const { targetRef, data, isLoading, mutate, isEndPage, isLoadingMore } =
    useSWRInfiniteScroll<UpdatedProfile>({
      key: `/user/${encodeURIComponent(username)}/friends/?type=all`,
    });

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
