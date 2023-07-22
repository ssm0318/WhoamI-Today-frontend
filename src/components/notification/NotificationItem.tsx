import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout } from '@design-system';
import { Notification } from '@models/notification';
import { readNotification } from '@utils/apis/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NotificationItemProps {
  item: Notification;
}

function NotificationItem({ item }: NotificationItemProps) {
  const { message, created_at, actor_detail, redirect_url } = item;
  const { profile_image } = actor_detail;
  const theme = useTheme();

  const navigate = useNavigate();

  const [createdAt] = useState(() => new Date(created_at));
  const [currentDate] = useState(() => new Date());

  const handleClickNotification = async () => {
    navigate(redirect_url);
    await readNotification([item.id]);
  };

  return (
    <Layout.FlexRow w="100%" onClick={handleClickNotification}>
      <Layout.FlexRow w={50} h={50} mr={7} alignItems="center" justifyContent="center">
        <ProfileImage imageUrl={profile_image} size={40} />
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
            {convertTimeDiffByString(currentDate, createdAt)}
          </span>
        </Font.Body>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default NotificationItem;
