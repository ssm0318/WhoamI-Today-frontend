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
  const { message, created_at, recent_actors, redirect_url, notification_type, is_read } = item;

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
      // User, FriendRequest는 어차피 profile image가 있어서 icon은 필요 없음
      // other의 경우는 아직 없는 케이스라 icon 없음
      case 'User':
      case 'FriendRequest':
      case 'other':
      default:
        return null;
    }
  };

  return (
    <Layout.FlexRow
      w="100%"
      onClick={handleClickNotification}
      ph={16}
      alignItems="center"
      bgColor={is_read ? 'WHITE' : 'LIGHT'}
    >
      <S.NotificationContent alignItems="center" pb={9} w="100%">
        <S.NotificationProfileContainer alignItems="center" justifyContent="center" h={50}>
          <ProfileImageList images={recent_actors.map((a) => a.profile_image)} size={40} />
          {!!getNotiIconName() && (
            <Layout.Absolute r={0} b={-5} z={2}>
              <SvgIcon name={getNotiIconName() as IconNames} size={20} />
            </Layout.Absolute>
          )}
        </S.NotificationProfileContainer>
        <Layout.FlexRow flex={1} ml={4}>
          <Typo type="body-medium">{message}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow ml={4}>
          <Typo type="label-small" color="MEDIUM_GRAY">
            {convertTimeDiffByString({ now: currentDate, day: createdAt, isShortFormat: true })}
          </Typo>
        </Layout.FlexRow>
      </S.NotificationContent>
    </Layout.FlexRow>
  );
}

export default NotificationItem;
