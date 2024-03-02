import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { Layout, SvgIcon, Typo } from '@design-system';
import { ChatRoom } from '@models/api/chat';

interface Props {
  room: ChatRoom;
  isEditMode?: boolean;
  hasSwipedItem?: boolean;
}

export function ChatRoomItem({ room, isEditMode, hasSwipedItem }: Props) {
  /* TODO: 안읽은 메시지 api 추가 필요 + 개수? */
  const hasUnreadMessages = false;
  const { id, participants, last_message_content, last_message_time } = room;
  const navigate = useNavigate();

  const handleClickItem = useCallback(() => {
    if (isEditMode || hasSwipedItem) return;
    navigate(`/chats/${id}`);
  }, [hasSwipedItem, id, isEditMode, navigate]);

  const [isChecked, setIsChecked] = useState(false);
  const handleToggleItem = useCallback(() => {
    setIsChecked((prev) => !prev);
  }, []);

  return (
    <Layout.FlexRow
      w="100%"
      justifyContent="space-between"
      gap={16}
      alignItems="center"
      ph={16}
      onMouseDown={handleClickItem}
    >
      {isEditMode && (
        <Icon
          name={isChecked ? 'checkbox_checked' : 'checkbox_default'}
          size={20}
          onClick={handleToggleItem}
        />
      )}
      <ProfileImage imageUrl={participants[0].profile_image} size={55} />
      <Layout.FlexCol w="100%" justifyContent="center" gap={5}>
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Typo type="label-large">{participants[0].username}</Typo>
          {last_message_time && (
            <Typo type="label-small" color="MEDIUM_GRAY">
              {formatLastMessageTime(last_message_time)}
            </Typo>
          )}
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Typo
            type={hasUnreadMessages ? 'label-medium' : 'body-small'}
            color={hasUnreadMessages ? 'BLACK' : 'MEDIUM_GRAY'}
          >
            {last_message_content ?? ''}
          </Typo>
          {hasUnreadMessages && <SvgIcon name="green_dot" size={10} />}
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
