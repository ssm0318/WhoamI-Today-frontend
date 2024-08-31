import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NotificationItem from '@components/notification/NotificationItem/NotificationItem';
import TopContainer from '@components/notification/TopContainer/TopContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Notification } from '@models/notification';
import { useBoundStore } from '@stores/useBoundStore';
import { getResponseRequests } from '@utils/apis/my';
import { getNotifications, readAllNotifications } from '@utils/apis/notification';
import { getFriendRequests } from '@utils/apis/user';

function Notifications() {
  const navigate = useNavigate();

  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);
  const [friendRequests, setFriendRequests] = useState<number | null>(null);
  const [responseRequests, setResponseRequests] = useState<number | null>(null);
  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchNotifications(nextPage ?? null);
  });
  const { openToast, updateMyProfile } = useBoundStore((state) => ({
    openToast: state.openToast,
    updateMyProfile: state.updateMyProfile,
  }));

  const fetchNotifications = async (page: string | null) => {
    const { results, next } = await getNotifications(page);
    if (!results) return;
    setNextPage(next);
    setNotifications([...notifications, ...results]);
    setIsLoading(false);
  };

  const handleReadAll = async () => {
    try {
      await readAllNotifications();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      updateMyProfile({
        unread_noti: false,
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      openToast({ message: t('temporary_error') });
    }
  };

  const recentNotifications = notifications.filter((n) => n.is_recent);
  const restNotifications = notifications.filter((n) => !n.is_recent);

  useAsyncEffect(async () => {
    try {
      const { count: friendRequestCount } = await getFriendRequests();
      setFriendRequests(friendRequestCount);

      const { count: responseRequestCount } = await getResponseRequests(null);
      setResponseRequests(responseRequestCount);
    } catch (error) {
      console.error('Error fetching requests:', error);
      openToast({ message: t('temporary_error') });
    }
  }, []);

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol w="100%">
        <Layout.FlexCol mb={4} mt={TITLE_HEADER_HEIGHT + 12} w="100%" ph={16}>
          {/* See Friend Requests */}
          <TopContainer
            title={t('see_friend_requests')}
            icon="friend_requests"
            value={friendRequests !== null ? friendRequests : 0}
            onClick={() => navigate('/friends/explore')}
          />
          {/* See Prompts Received */}
          <TopContainer
            title={t('see_prompts_received')}
            icon="prompts"
            value={responseRequests !== null ? responseRequests : 0}
            onClick={() => navigate('/notifications/prompts')}
          />
        </Layout.FlexCol>
        {/* 노티 전체 읽음 버튼 */}
        <Layout.FlexRow w="100%" justifyContent="flex-end" pr="default" pv={8}>
          <button type="button" onClick={handleReadAll}>
            <Typo type="button-medium" color="PRIMARY">
              {t('read_all')}
            </Typo>
          </button>
        </Layout.FlexRow>

        {/* Last 7 days */}
        {recentNotifications.length > 0 && (
          <>
            <Layout.FlexRow pv={8} ph={16}>
              <Typo type="title-medium">{t('last_7_days')}</Typo>
            </Layout.FlexRow>
            {recentNotifications.map((noti) => (
              <NotificationItem item={noti} key={noti.id} />
            ))}
          </>
        )}
        {/* Rest of notifications */}
        {restNotifications.length > 0 && (
          <>
            <Layout.FlexRow mt={8} pv={8} ph={16}>
              <Typo type="title-medium">{t('last_30_days')}</Typo>
            </Layout.FlexRow>
            {restNotifications.map((noti) => (
              <NotificationItem item={noti} key={noti.id} />
            ))}
          </>
        )}
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
