import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends/explore-friends/friend-item/FriendItem';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';

export default function RecommendedList() {
  const [t] = useTranslation('translation', {
    keyPrefix: 'friends.explore_friends.recommended_list',
  });

  const [friendList, setFriendList] = useState<User[]>();
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  // FIXME: 추천 친구 목록을 불러올 수 있도록 수정
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

  if (!friendList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" pv={12} ph={16} gap={4}>
      <Layout.LayoutBase pv={13}>
        <Typo type="body-medium" color="MEDIUM_GRAY" ml={5} mb={2}>
          {t('title', { number: friendList.length })}
        </Typo>
      </Layout.LayoutBase>
      {friendList.length > 0 ? (
        <>
          {friendList.map((friend) => (
            <FriendItem
              key={friend.id}
              type="recommended"
              user={friend}
              updateList={fetchFriends}
            />
          ))}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </>
      ) : (
        <NoContents text={t('no_contents.friends')} />
      )}
    </Layout.FlexCol>
  );
}
