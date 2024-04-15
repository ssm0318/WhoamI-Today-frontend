import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImageList from '@components/_common/profile-image-list/ProfileImageList';
import { IconNames, Layout, SvgIcon, Typo } from '@design-system';
import { Notification } from '@models/notification';
import { readNotification } from '@utils/apis/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import * as S from './NotificationItem.styled';

interface NotificationItemProps {
  item: Notification;
}

function NotificationItem({ item }: NotificationItemProps) {
  const { message, created_at, recent_actors, redirect_url, notification_type } = item;

  const navigate = useNavigate();

  const [createdAt] = useState(() => new Date(created_at));
  const [currentDate] = useState(() => new Date());

  const handleClickNotification = async () => {
    navigate(redirect_url);
    await readNotification([item.id]);
  };

  // TODO fix this if other notis are added
  const getNotiIconName = (): IconNames => {
    switch (notification_type) {
      case 'Like':
        return 'noti_icon_like';
      case 'Comment':
        return 'noti_icon_public_comment';
      case 'Response':
        return 'noti_icon_prompt';
      default:
        return 'noti_icon_prompt';
    }
  };

  return (
    <S.NotificationContainer w="100%" onClick={handleClickNotification} pv={9} alignItems="center">
      <Layout.FlexRow
        alignItems="center"
        justifyContent="center"
        style={{
          position: 'relative',
        }}
      >
        <ProfileImageList images={recent_actors.map((a) => a.profile_image)} size={40} />
        <Layout.Absolute r={0} b={-10}>
          <SvgIcon name={getNotiIconName()} size={20} />
        </Layout.Absolute>
      </Layout.FlexRow>
      <Layout.FlexRow flex={1} ml={4}>
        <Typo type="body-medium">{message}</Typo>
      </Layout.FlexRow>
      <Layout.FlexRow ml={4}>
        <Typo type="label-small" color="MEDIUM_GRAY">
          {convertTimeDiffByString(currentDate, createdAt, 'yyyy.MM.dd HH:mm', true)}
        </Typo>
      </Layout.FlexRow>
    </S.NotificationContainer>
  );
}

export default NotificationItem;
