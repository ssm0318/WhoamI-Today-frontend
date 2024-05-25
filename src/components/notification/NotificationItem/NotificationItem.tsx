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

  const getNotiIconName = (): IconNames | null => {
    switch (notification_type) {
      case 'Like':
        return 'noti_icon_like';
      case 'Comment':
        return 'noti_icon_public_comment';
      case 'Response':
      case 'ResponseRequest':
        return 'noti_icon_prompt';
      case 'User':
      case 'FriendRequest':
      case 'other':
      default:
        return null;
    }
  };

  return (
    <S.NotificationContainer w="100%" onClick={handleClickNotification} pv={9} alignItems="center">
      <S.NotificationContent alignItems="center" justifyContent="center">
        <ProfileImageList images={recent_actors.map((a) => a.profile_image)} size={40} />
        {!!getNotiIconName() && (
          <Layout.Absolute r={0} b={-10} z={2}>
            <SvgIcon name={getNotiIconName() as IconNames} size={20} />
          </Layout.Absolute>
        )}
      </S.NotificationContent>
      <Layout.FlexRow flex={1} ml={4}>
        <Typo type="body-medium">{message}</Typo>
      </Layout.FlexRow>
      <Layout.FlexRow ml={4}>
        <Typo type="label-small" color="MEDIUM_GRAY">
          {convertTimeDiffByString({ now: currentDate, day: createdAt, isShortFormat: true })}
        </Typo>
      </Layout.FlexRow>
    </S.NotificationContainer>
  );
}

export default NotificationItem;
