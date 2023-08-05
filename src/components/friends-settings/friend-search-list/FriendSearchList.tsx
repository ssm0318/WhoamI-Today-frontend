import { useCallback, useEffect, useState } from 'react';
import Loader from '@components/_common/loader/Loader';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { UserProfile } from '@models/user';
import { searchUser } from '@utils/apis/user';

interface Props {
  query: string;
}

export default function FriendSearchList({ query }: Props) {
  const [searchList, setSearchList] = useState<UserProfile[]>();
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchUsers = useCallback(async (_query: string, _next?: string | null) => {
    const { results = [], next } = await searchUser(_query, _next);
    setSearchList((prev) => (_next ? (prev ? [...prev, ...results] : []) : results));
    setNextUrl(next);
  }, []);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) await fetchUsers(query, nextUrl);
    setIsLoading(false);
  });

  useEffect(() => {
    fetchUsers(query);
  }, [fetchUsers, query]);

  if (!searchList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" pl={10} pr={10} gap={8}>
      {searchList.length > 0 ? (
        <>
          {searchList.map((user) => (
            <FriendItem key={user.id} type="search" user={user} />
          ))}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </>
      ) : (
        <>TODO: Not Found</>
      )}
    </Layout.FlexCol>
  );
}