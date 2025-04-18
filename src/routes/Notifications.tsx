import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import NotificationItem from '@components/notification/NotificationItem/NotificationItem';
import TopContainer from '@components/notification/TopContainer/TopContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Notification } from '@models/notification';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getResponseRequests } from '@utils/apis/my';
import { readAllNotifications } from '@utils/apis/notification';
import { getFriendRequests } from '@utils/apis/user';
import { MainScrollContainer } from './Root';

function Notifications() {
  const navigate = useNavigate();

  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });

  const [friendRequests, setFriendRequests] = useState<number | null>(null);
  const [responseRequests, setResponseRequests] = useState<number | null>(null);

  const { featureFlags } = useBoundStore(UserSelector);

  const { openToast, updateMyProfile } = useBoundStore((state) => ({
    openToast: state.openToast,
    updateMyProfile: state.updateMyProfile,
  }));

  const {
    targetRef,
    data: allNotifications,
    isLoading: isNotificationsLoading,
    mutate: mutateNotifications,
    isLoadingMore: isNotificationsLoadingMore,
  } = useSWRInfiniteScroll<Notification>({
    key: '/notifications/',
  });

  const flatNotifications = allNotifications?.flatMap((page) => page.results ?? []) ?? [];
  const recentNotifications = flatNotifications.filter((n) => n.is_recent);
  const restNotifications = flatNotifications.filter((n) => !n.is_recent);

  const fetchRequests = async () => {
    try {
      if (featureFlags?.questionResponseFeature) {
        const [friendResponse, responseResponse] = await Promise.all([
          getFriendRequests(),
          getResponseRequests(null),
        ]);
        setFriendRequests(friendResponse.count);
        setResponseRequests(responseResponse.count);
      } else {
        const friendResponse = await getFriendRequests();
        setFriendRequests(friendResponse.count);
        setResponseRequests(0);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      openToast({ message: t('temporary_error') });
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([mutateNotifications(), fetchRequests()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      openToast({ message: t('temporary_error') });
    }
  };

  const handleReadAll = async () => {
    try {
      await readAllNotifications();
      mutateNotifications(
        allNotifications?.map((prev) => ({
          ...prev,
          results: prev.results?.map((n) => ({ ...n, is_read: true })) ?? [],
        })) ?? [],
        { revalidate: false },
      );
      updateMyProfile({
        unread_noti: false,
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      openToast({ message: t('temporary_error') });
    }
  };

  useAsyncEffect(async () => {
    if (!featureFlags?.questionResponseFeature) return;
    await fetchRequests();
  }, [featureFlags]);

  const { scrollRef } = useRestoreScrollPosition('notificationsPage');

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <SubHeader title={t('title')} />
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          <Layout.FlexCol mb={4} mt={12} w="100%" ph={16}>
            {/* See Friend Requests */}
            <TopContainer
              title={t('see_friend_requests')}
              icon="friend_requests"
              value={friendRequests !== null ? friendRequests : 0}
              onClick={() => navigate('/friends/explore')}
            />
            {!!featureFlags?.questionResponseFeature && (
              <TopContainer
                title={t('see_prompts_received')}
                icon="prompts"
                value={responseRequests !== null ? responseRequests : 0}
                onClick={() => navigate('/notifications/prompts')}
              />
            )}
          </Layout.FlexCol>
          {/* 노티 전체 읽음 버튼 */}
          <Layout.FlexRow w="100%" justifyContent="flex-end" pr="default" pv={8}>
            <button type="button" onClick={handleReadAll}>
              <Typo type="button-medium" color="PRIMARY">
                {t('read_all')}
              </Typo>
            </button>
          </Layout.FlexRow>
          {/** Notifications */}
          {isNotificationsLoading ? (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          ) : allNotifications?.[0] && allNotifications[0].count > 0 ? (
            <>
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
                    <Typo type="title-medium">{t('earlier')}</Typo>
                  </Layout.FlexRow>
                  {restNotifications.map((noti) => (
                    <NotificationItem item={noti} key={noti.id} />
                  ))}
                </>
              )}
              <div ref={targetRef} />
              {isNotificationsLoadingMore && (
                <Layout.FlexRow w="100%" h={40}>
                  <Loader />
                </Layout.FlexRow>
              )}
            </>
          ) : null}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Notifications;
