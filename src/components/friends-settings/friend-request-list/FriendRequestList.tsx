import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { FriendRequest } from '@models/api/user';
import { getFriendRequests } from '@utils/apis/user';

export default function FriendRequestList() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.request_list' });

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
    <Layout.FlexCol w="100%" ph={10} gap={8}>
      <Font.Body type="14_regular" color="GRAY_12" ml={5} mb={2}>
        {t('title', { number: friendRequests.length })}
      </Font.Body>
      {friendRequests.length ? (
        <Layout.FlexCol w="100%" gap={8}>
          {friendRequests.map(({ requester_id, requester_detail }) => (
            <FriendItem key={requester_id} type="request" user={requester_detail} />
          ))}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </Layout.FlexCol>
      ) : (
        <NoRequests />
      )}
    </Layout.FlexCol>
  );
}

function NoRequests() {
  const [t] = useTranslation('translation', {
    keyPrefix: 'settings.friends.request_list.no_requests',
  });

  return (
    <Layout.FlexRow
      w="100%"
      alignSelf="center"
      justifyContent="space-evenly"
      bgColor="GRAY_7"
      rounded={13}
      pt={10}
      pb={10}
    >
      <Layout.FlexCol w="100$" alignItems="center">
        <Font.Body type="14_semibold" color="GRAY_12">
          {t('title')}
        </Font.Body>
        <Font.Body type="14_semibold" color="GRAY_12">
          {t('text')}
        </Font.Body>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
