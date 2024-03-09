import { useState } from 'react';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { FetchState } from '@models/api/common';
import { GetUpdatedProfileResponse } from '@models/api/friends';
import { getAllFriends, getFriendsOptions } from '@utils/apis/friends';

const useInfiniteFetchFriends = (options?: getFriendsOptions) => {
  const [allFriends, setAllFriends] = useState<FetchState<GetUpdatedProfileResponse>>({
    state: 'loading',
  });

  const fetchAllFriends = async (next?: string) => {
    try {
      const data = await getAllFriends({ filterHidden: options?.filterHidden, next });
      setAllFriends((prev) =>
        next
          ? {
              state: 'hasValue',
              data: {
                ...data,
                results: prev?.data?.results
                  ? [...prev.data.results, ...(data.results ?? [])]
                  : data.results,
                next: data.next,
              },
            }
          : { state: 'hasValue', data },
      );
    } catch {
      setAllFriends({ state: 'hasError' });
    }
  };

  const {
    isLoading: isLoadingMoreAllFriends,
    targetRef,
    setIsLoading: setIsLoadingMoreAllFriends,
  } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (allFriends?.data?.next) {
      await fetchAllFriends(allFriends.data.next);
      setIsLoadingMoreAllFriends(true);
      return;
    }

    setIsLoadingMoreAllFriends(false);
  });

  return { isLoadingMoreAllFriends, allFriends, fetchAllFriends, targetRef };
};

export default useInfiniteFetchFriends;
