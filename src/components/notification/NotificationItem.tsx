import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import UserProfile from '@components/_common/user-profile/UserProfile';
import { Font, Layout } from '@design-system';
import { Notification } from '@models/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NotificationItemProps {
  item: Notification;
}

function NotificationItem({ item }: NotificationItemProps) {
  const { message, created_at, actor_detail, redirect_url } = item;
  const { profile_image } = actor_detail;
  const theme = useTheme();

  const navigate = useNavigate();

  const handleClickNotification = () => {
    return navigate(redirect_url);
  };

  return (
    <Layout.FlexRow w="100%" onClick={handleClickNotification}>
      <Layout.FlexRow w={50} h={50} mr={7} alignItems="center" justifyContent="center">
        <UserProfile imageUrl={profile_image} size={40} />
      </Layout.FlexRow>
      <Layout.FlexRow flex={1}>
        <Font.Body type="14_regular">
          {message}
          <span
            style={{
              color: theme.GRAY_4,
              marginLeft: 4,
            }}
          >
            {convertTimeDiffByString(new Date(), new Date(created_at))}
          </span>
        </Font.Body>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default NotificationItem;
