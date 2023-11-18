import { useCallback, useEffect, useState } from 'react';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';
import useInfiniteScroll from './useInfiniteScroll';

const useFriendList = () => {
  const [friendList, setFriendList] = useState<User[]>();
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchFriends = useCallback(async (_next?: string | null) => {
    const { results = [], next } = await getFriendList(_next);
    setFriendList((prev) => (_next ? (prev ? [...prev, ...results] : []) : results));
    setNextUrl(next);
  }, []);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) await fetchFriends(nextUrl);
    setIsLoading(false);
  });

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return {
    friendList,
    isLoading,
    iniFiniteLoadingRef: targetRef,
    fetchFriends,
  };
};

export default useFriendList;
