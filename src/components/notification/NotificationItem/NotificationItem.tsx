import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImageList from '@components/_common/profile-image-list/ProfileImageList';
import { IconNames, Layout, SvgIcon, Typo } from '@design-system';
import { Notification } from '@models/notification';
import { readNotification } from '@utils/apis/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import NotificationActions from './NotificationActions';
import * as S from './NotificationItem.styled';

interface NotificationItemProps {
  item: Notification;
  onActioned?: (id: number) => void;
}

function NotificationItem({ item, onActioned }: NotificationItemProps) {
  const {
    message,
    created_at,
    recent_actors,
    redirect_url,
    notification_type,
    is_read,
    thumbnail_url,
  } = item;

  const navigate = useNavigate();

  const [createdAt] = useState(() => new Date(created_at));
  const [currentDate] = useState(() => new Date());

  const handleClickNotification = async () => {
    if (notification_type === 'QuestionSuggest') {
      // Navigate to question suggestion page
      navigate('/suggest-questions');
    } else {
      navigate(redirect_url);
    }
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
      case 'Message':
        return 'chat_filled';
      // User, FriendRequest already have profile images so no icon needed
      // Other cases don't exist yet so no icon
      case 'DailySurvey':
      case 'User':
      case 'FriendRequest':
      case 'QuestionSuggest':
      default:
        return null;
    }
  };

  const [actioned, setActioned] = useState(false);
  const showInlineActions = !actioned && (item.is_friend_request || item.is_chat_request);

  const handleActioned = async () => {
    setActioned(true);
    await readNotification([item.id]);
    onActioned?.(item.id);
  };

  return (
    <Layout.FlexCol w="100%" ph={16} bgColor={is_read ? 'WHITE' : 'LIGHT'}>
      <Layout.FlexRow w="100%" onClick={handleClickNotification} alignItems="center">
        <S.NotificationContent
          alignItems="center"
          pb={showInlineActions ? 0 : 9}
          w="100%"
          border={!is_read && !showInlineActions}
        >
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
          {thumbnail_url && <S.NotificationThumbnail src={thumbnail_url} alt="" />}
          <Layout.FlexRow ml={4}>
            <Typo type="label-small" color="MEDIUM_GRAY">
              {convertTimeDiffByString({ now: currentDate, day: createdAt, isShortFormat: true })}
            </Typo>
          </Layout.FlexRow>
        </S.NotificationContent>
      </Layout.FlexRow>
      {showInlineActions && (
        <Layout.FlexRow
          w="100%"
          pl={44}
          pb={9}
          mt={-4}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <NotificationActions item={item} onActioned={handleActioned} />
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default NotificationItem;
