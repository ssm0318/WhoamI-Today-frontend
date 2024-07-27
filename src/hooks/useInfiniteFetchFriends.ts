import useSWRInfinite from 'swr/infinite';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { GetUpdatedProfileResponse } from '@models/api/friends';
import { getAllFriends, getFriendsOptions } from '@utils/apis/friends';

const getKey = (pageIndex: number, previousPageData: GetUpdatedProfileResponse) => {
  if (previousPageData && !previousPageData.next) return null; // 끝에 도달
  return `/user/friends/?type=all&page=${pageIndex + 1}`; // SWR 키
};

const useInfiniteFetchFriends = (options?: getFriendsOptions) => {
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, (url) => {
    return getAllFriends({ filterHidden: options?.filterHidden, next: url });
  });
  const isEndPage = data && !data[size - 1]?.next;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const fetchAllFriends = () => {
    if (isEndPage) return;
    setSize((prevSize) => prevSize + 1);
  };

  // const replaceFriendOnUpdateFavorite = (
  //   updatedTargetProfile: UpdatedProfile | undefined,
  //   targetProfile: UpdatedProfile,
  // ) => {
  //   setAllFriends((prev) => {
  //     const { state, data } = prev;
  //     if (state !== 'hasValue' || !data?.results?.length) return prev;

  //     const targetId = updatedTargetProfile ? updatedTargetProfile.id : targetProfile.id;
  //     const findIndex = data.results.findIndex((profile) => profile.id === targetId);
  //     if (findIndex === -1) return prev;

  //     const profile = updatedTargetProfile ?? { ...targetProfile, is_favorite: false };
  //     data.results.splice(findIndex, 1, profile);
  //     return prev;
  //   });
  // };

  const { targetRef } = useInfiniteScroll<HTMLDivElement>(() => {
    fetchAllFriends();
  });

  return {
    isLoadingMoreAllFriends: isLoadingMore,
    targetRef,
    allFriends: data,
    isAllFriendsLoading: isLoading,
    isEndPage,
    // replaceFriendOnUpdateFavorite,
  };
};

export default useInfiniteFetchFriends;
