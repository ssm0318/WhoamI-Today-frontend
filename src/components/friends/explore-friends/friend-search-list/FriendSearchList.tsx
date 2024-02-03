import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends/explore-friends/friend-item/FriendItem';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { UserProfile } from '@models/user';
import { searchUser } from '@utils/apis/user';

interface Props {
  query: string;
}

export default function FriendSearchList({ query }: Props) {
  const [t] = useTranslation('translation');

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

  const { friendsResult, moreResult } = useMemo(() => {
    if (!searchList) return { friendsResult: [], moreResult: [] };
    return searchList.reduce(
      (result, item) => {
        if (item.are_friends) result.friendsResult.push(item);
        else result.moreResult.push(item);
        return result;
      },
      { friendsResult: [] as UserProfile[], moreResult: [] as UserProfile[] },
    );
  }, [searchList]);

  const handleClickRequest = (userId: number) => () => {
    setSearchList((prev) => {
      return prev?.reduce<UserProfile[]>((result, curr) => {
        if (curr.id !== userId) {
          result.push(curr);
        } else {
          result.push({
            ...curr,
            sent_friend_request_to: true,
          });
        }
        return result;
      }, []);
    });
  };

  const handleClickDelete = (userId: number) => () => {
    setSearchList((prev) => {
      return prev?.reduce<UserProfile[]>((result, curr) => {
        if (curr.id !== userId) {
          result.push(curr);
        } else {
          result.push({
            ...curr,
            are_friends: false,
          });
        }
        return result;
      }, []);
    });
  };

  if (!searchList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" ph={16} gap={8}>
      {searchList.length > 0 ? (
        <>
          {friendsResult.length > 0 && (
            <Layout.FlexCol w="100%">
              <Layout.LayoutBase pv={13}>
                <Typo type="body-medium" color="MEDIUM_GRAY">
                  {t('friends.explore_friends.search.your_friends')}
                </Typo>
              </Layout.LayoutBase>
              {friendsResult.map((user) => (
                <FriendItem
                  key={user.id}
                  type="search"
                  user={user}
                  disableRequest={user.are_friends}
                  onClickDelete={handleClickDelete(user.id)}
                />
              ))}
            </Layout.FlexCol>
          )}
          {moreResult.length > 0 && (
            <Layout.FlexCol w="100%">
              <Layout.LayoutBase pv={13}>
                <Typo type="body-medium" color="MEDIUM_GRAY">
                  {t('friends.explore_friends.search.more_results')}
                </Typo>
              </Layout.LayoutBase>
              {moreResult.map((user) => (
                <FriendItem
                  key={user.id}
                  type="search"
                  user={user}
                  disableRequest={user.sent_friend_request_to}
                  onClickRequest={handleClickRequest(user.id)}
                />
              ))}
            </Layout.FlexCol>
          )}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </>
      ) : (
        <NoContents text={t('no_contents.friends_search')} />
      )}
    </Layout.FlexCol>
  );
}
