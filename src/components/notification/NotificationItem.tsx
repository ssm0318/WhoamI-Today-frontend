import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Font, Layout } from '@design-system';
import { Notification } from '@models/notification';
import { readNotification } from '@utils/apis/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NotificationItemProps {
  item: Notification;
}

function NotificationItem({ item }: NotificationItemProps) {
  const { message, created_at, actor_detail, redirect_url, is_read } = item;
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
    <Layout.FlexRow
      w="100%"
      onClick={handleClickNotification}
      pv={14}
      bgColor={is_read ? 'WHITE' : 'GRAY_10'}
      ph={DEFAULT_MARGIN}
    >
      <Layout.FlexRow w={50} h={50} mr={7} alignItems="center" justifyContent="center">
        <ProfileImage imageUrl={profile_image} size={40} />
      </Layout.FlexRow>

      <Layout.FlexRow flex={1}>
        <Font.Body type={is_read ? '14_regular' : '14_semibold'}>
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
      {!is_read && <Layout.LayoutBase w={10} h={10} bgColor="NUDGE" rounded={5} mr={2} />}
    </Layout.FlexRow>
  );
}

export default NotificationItem;
