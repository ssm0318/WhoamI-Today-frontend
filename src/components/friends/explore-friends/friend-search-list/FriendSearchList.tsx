import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends/explore-friends/friend-item/FriendItem';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { UserProfile } from '@models/user';
import { searchUser } from '@utils/apis/user';

interface Props {
  query: string;
}

export default function FriendSearchList({ query }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'no_contents' });

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
    <Layout.FlexCol w="100%" ph={10} gap={8}>
      {searchList.length > 0 ? (
        <>
          {searchList.map((user) => (
            <FriendItem key={user.id} type="search" user={user} areFriends={user.are_friends} />
          ))}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </>
      ) : (
        <NoContents text={t('friends_search')} />
      )}
    </Layout.FlexCol>
  );
}
