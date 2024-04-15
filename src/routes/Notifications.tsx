import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NotificationItem from '@components/notification/NotificationItem/NotificationItem';
import TopContainer from '@components/notification/TopContainer/TopContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Notification } from '@models/notification';
import { getNotifications } from '@utils/apis/notification';

function Notifications() {
  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchNotifications(nextPage ?? null);
  });

  const fetchNotifications = async (page: string | null) => {
    const { results, next } = await getNotifications(page);
    if (!results) return;
    setNextPage(next);
    setNotifications([...notifications, ...results]);
    setIsLoading(false);
  };

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%">
        <Layout.FlexCol mt={12} mb={4} w="100%">
          {/* See Friend Requests */}
          <TopContainer type="FriendRequest" />
          {/* See Prompts Received */}
          <TopContainer type="PromptsReceived" />
        </Layout.FlexCol>
        {/* Last 7 days */}
        {notifications.map((noti) => (
          <NotificationItem item={noti} key={noti.id} />
        ))}
        {/* Rest of notifications */}
        <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default Notifications;
