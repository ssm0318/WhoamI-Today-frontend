import UserProfile from '@components/_common/user-profile/UserProfile';
import { Font, Layout } from '@design-system';
import { Notification } from '@models/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NotificationItemProps {
  item: Notification;
}

function NotificationItem({ item }: NotificationItemProps) {
  const { message, created_at, actor_detail } = item;
  const { profile_image } = actor_detail;
  return (
    <Layout.FlexRow w="100%">
      <Layout.LayoutBase w={50} h={50} mr={7} alignItems="center" justifyContent="center">
        <UserProfile imageUrl={profile_image} size={40} />
      </Layout.LayoutBase>
      <Layout.FlexRow alignItems="flex-start" mt={8}>
        <Font.Body type="14_regular">{message}</Font.Body>
        <Font.Body type="14_regular" color="GRAY_3" ml={4}>
          {convertTimeDiffByString(new Date(), new Date(created_at))}
        </Font.Body>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default NotificationItem;
