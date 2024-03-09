import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { Layout, SvgIcon, Typo } from '@design-system';
import { ChatRoom } from '@models/api/chat';
import { StyledCheckBox } from './ChatRoomItem.styled';

interface Props {
  room: ChatRoom;
  isEditMode?: boolean;
  hasSwipedItem?: boolean;
  checkList?: Set<number>;
  onClickCheckBox?: (roomId: number) => void;
}

export function ChatRoomItem({
  room,
  isEditMode,
  hasSwipedItem,
  checkList,
  onClickCheckBox,
}: Props) {
  /* TODO: 안읽은 메시지 api 추가 필요 + 개수? */
  const hasUnreadMessages = false;
  /* TODO: 채팅방 알림 뮤트 여부 적용 */
  const isMute = false;
  const { id, participants, last_message_content, last_message_time } = room;
  const navigate = useNavigate();

  const handleClickItem = useCallback(() => {
    if (isEditMode) {
      onClickCheckBox?.(id);
      return;
    }

    if (!hasSwipedItem) {
      navigate(`/chats/${id}`);
    }
  }, [hasSwipedItem, id, isEditMode, navigate, onClickCheckBox]);

  const handleChangeCheckBox = useCallback(() => {
    onClickCheckBox?.(id);
  }, [id, onClickCheckBox]);

  return (
    <Layout.FlexRow w="100%" pl={16} gap={16} justifyContent="space-between" alignItems="center">
      {isEditMode && (
        <StyledCheckBox
          name={participants[0].username}
          onChange={handleChangeCheckBox}
          checked={checkList?.has(id)}
        />
      )}
      <Layout.FlexRow
        w="100%"
        justifyContent="space-between"
        gap={16}
        alignItems="center"
        pr={16}
        onMouseDown={handleClickItem}
      >
        <ProfileImage imageUrl={participants[0].profile_image} size={55} />
        <Layout.FlexCol w="100%" justifyContent="center" gap={5}>
          <Layout.FlexRow w="100%" justifyContent="space-between">
            <Layout.FlexRow gap={4} alignItems="center">
              <Typo type="label-large">{participants[0].username}</Typo>
              {isMute && <SvgIcon name="chat_notification_mute" size={12} />}
            </Layout.FlexRow>
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
    </Layout.FlexRow>
  );
}
