import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends/explore-friends/friend-item/FriendItem';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { FriendRequest } from '@models/api/user';
import { getFriendRequests } from '@utils/apis/user';
import { SentRequestsModal } from './SentRequestsModal';

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

  const updateList = (requesterId: number) => () => {
    setFriendRequests((prev) => {
      if (!prev) return prev;

      const itemIndex = prev.findIndex(({ requester_id }) => requester_id === requesterId);
      if (itemIndex === -1) return prev;

      const next = [...prev];
      next.splice(itemIndex, 1);
      return next;
    });
  };

  const [isSentRequestsModalVisible, setIsSentRequestsModalVisible] = useState(false);

  const handleClickSentRequests = () => {
    setIsSentRequestsModalVisible(true);
  };

  if (!friendRequests) return <Loader />;
  return (
    <Layout.FlexCol w="100%" pv={12} ph={16} gap={4}>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" pv={5}>
        <Typo type="body-medium" color="MEDIUM_GRAY" ml={5} mb={2}>
          {t('title', { number: friendRequests.length })}
        </Typo>
        <Button.Tertiary
          fontType="body-medium"
          status="normal"
          text={t('sent_requests')}
          icon={<SvgIcon name="arrow_right" size={20} />}
          onClick={handleClickSentRequests}
        />
      </Layout.FlexRow>
      {friendRequests.length ? (
        <>
          {friendRequests.map(({ requester_id, requester_detail }) => (
            <FriendItem
              key={requester_id}
              type="requests"
              user={requester_detail}
              onClickConfirm={updateList(requester_id)}
              onClickReject={updateList(requester_id)}
            />
          ))}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </>
      ) : (
        <NoContents
          title={t('no_requests.title')}
          text={t('no_requests.text')}
          bgColor="INPUT_GRAY"
        />
      )}
      {isSentRequestsModalVisible && (
        <SentRequestsModal
          visible={isSentRequestsModalVisible}
          onClose={() => setIsSentRequestsModalVisible(false)}
        />
      )}
    </Layout.FlexCol>
  );
}
