import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { SentFriendRequest } from '@models/api/user';
import { getSentFriendRequests } from '@utils/apis/user';
import FriendItem from '../friend-item/FriendItem';
import { StyledModalHeader, StyledTitle } from './SentRequestsModal.styled';

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

  const contentHeight = window.innerHeight - 20;

  return (
    <BottomModal visible={visible} onClose={onClose} maxHeight={contentHeight}>
      <Layout.FlexCol w="100%">
        <Layout.FlexCol w="100%" h={contentHeight}>
          <StyledModalHeader w="100%" pv={12} bgColor="WHITE">
            <StyledTitle w="100%" pt={5} alignItems="center" justifyContent="center">
              <Layout.Absolute l={16} pv={3}>
                <Icon name="close" size={20} padding={6} onClick={onClose} />
              </Layout.Absolute>
              <Typo type="title-large">{t('title')}</Typo>
            </StyledTitle>
          </StyledModalHeader>
          <Layout.FlexCol w="100%" pv={12} ph={16}>
            {sentRequests?.length > 0 ? (
              <>
                {sentRequests.map(({ requestee_id, requestee_detail }) => (
                  <FriendItem
                    key={requestee_id}
                    type="sent_requests"
                    user={requestee_detail}
                    disableRequest
                    onClickDelete={updateList(requestee_id)}
                  />
                ))}
                <div ref={targetRef} />
                {isLoading && <Loader />}
              </>
            ) : (
              <NoContents title={t('no_contents.title')} bgColor="INPUT_GRAY" />
            )}
          </Layout.FlexCol>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>
  );
}
