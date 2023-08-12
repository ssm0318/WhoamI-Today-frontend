import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';

function FriendList() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.friend_list' });

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

  if (!friendList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" ph={10} gap={8}>
      <Font.Body type="14_regular" color="GRAY_12" ml={5} mb={2}>
        {t('title', { number: friendList.length })}
      </Font.Body>
      <Layout.FlexCol w="100%" gap={8}>
        {friendList.map((friend) => (
          <FriendItem key={friend.id} type="friends" user={friend} updateList={fetchFriends} />
        ))}
        <div ref={targetRef} />
        {isLoading && <Loader />}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default FriendList;
