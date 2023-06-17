import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NotificationItem from '@components/notification/NotificationItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { notification } from '@mock/notification';
import { Notification } from '@models/notification';

function Notifications() {
  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });

  const notiList: Notification[] = [notification];

  const fetchMoreNotifications = async () => {
    console.log('fetch more');
  };

  const { targetRef, isLoading } = useInfiniteScroll<HTMLDivElement>(fetchMoreNotifications);

  return (
    <MainContainer>
      <TitleHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {notiList.map((noti) => (
          <NotificationItem item={noti} key={noti.id} />
        ))}
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
