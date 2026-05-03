import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { SentFriendRequest } from '@models/api/user';
import { getSentFriendRequests } from '@utils/apis/user';
import FriendItem from '../friend-item/FriendItem';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SentRequestsModal({ visible, onClose }: Props) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'friends.explore_friends.sent_requests_modal',
  });
  const [sentRequests, setSentRequests] = useState<SentFriendRequest[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchSentRequests = useCallback(async (_next?: string | null) => {
    const { results = [], next } = await getSentFriendRequests(_next);
    setSentRequests((prev) => (_next ? (prev ? [...prev, ...results] : []) : results));
    setNextUrl(next);
  }, []);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) await fetchSentRequests(nextUrl);
    setIsLoading(false);
  });

  useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  const updateList = (requesteeId: number) => () => {
    setSentRequests((prev) => {
      if (!prev) return prev;

      const itemIndex = prev.findIndex(({ requestee_id }) => requestee_id === requesteeId);
      if (itemIndex === -1) return prev;

      const next = [...prev];
      next.splice(itemIndex, 1);
      return next;
    });
  };

  return (
    <BottomModal visible={visible} onClose={onClose} heightMode="full" draggable>
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('title')}
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.FlexCol w="100%" pv={12} ph={16}>
        {sentRequests?.length > 0 ? (
          <>
            {sentRequests.map(({ requestee_id, requestee_detail }) => (
              <FriendItem
                key={requestee_id}
                type="sent_requests"
                user={requestee_detail}
                onClickCancelRequest={updateList(requestee_id)}
              />
            ))}
            <div ref={targetRef} />
            {isLoading && <Loader />}
          </>
        ) : (
          <NoContents title={t('no_contents.title')} bgColor="INPUT_GRAY" />
        )}
      </Layout.FlexCol>
    </BottomModal>
  );
}
