import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends/explore-friends/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { FriendRequest } from '@models/api/user';
import { getFriendRequests } from '@utils/apis/user';

export default function RequestList() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.request_list' });

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>();
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchRequests = useCallback(async (_next?: string | null) => {
    const { results = [], next } = await getFriendRequests(_next);
    const unacceptedRequests = results.filter((result) => !result.accepted);
    setFriendRequests((prev) =>
      _next ? (prev ? [...prev, ...unacceptedRequests] : []) : unacceptedRequests,
    );
    setNextUrl(next);
  }, []);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) await fetchRequests(nextUrl);
    setIsLoading(false);
  });

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (!friendRequests) return <Loader />;
  return (
    <Layout.FlexCol w="100%" pv={12} ph={16} gap={4}>
      <Font.Body type="14_regular" color="MEDIUM_GRAY" ml={5} mb={2}>
        {t('title', { number: friendRequests.length })}
      </Font.Body>
      {friendRequests.length ? (
        <Layout.FlexCol w="100%" gap={8}>
          {friendRequests.map(({ requester_id, requester_detail }) => (
            <FriendItem
              key={requester_id}
              type="request"
              user={requester_detail}
              updateList={fetchRequests}
            />
          ))}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </Layout.FlexCol>
      ) : (
        <NoContents title={t('no_requests.title')} text={t('no_requests.text')} ph={10} />
      )}
    </Layout.FlexCol>
  );
}
