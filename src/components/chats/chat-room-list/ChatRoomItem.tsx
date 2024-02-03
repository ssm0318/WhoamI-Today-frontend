import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { SwipeLayoutListContext } from '@components/_common/swipe-layout/SwipeLayoutList';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import { Layout, SvgIcon, Typo } from '@design-system';
import { ChatRoom } from '@models/api/chat';

interface Props {
  room: ChatRoom;
}

export function ChatRoomItem({ room }: Props) {
  /* TODO: 안읽은 메시지 api 추가 필요 + 개수? */
  const hasUnreadMessages = false;
  const { id, participants, last_message_content, last_message_time } = room;
  const navigate = useNavigate();

  const { hasSwipedItem } = useContext(SwipeLayoutListContext);

  const handleClickItem = () => {
    if (hasSwipedItem) return;
    navigate(`/chats/${id}`);
  };

  return (
    <SwipeLayout
      rightContent={[
        <StyledSwipeButton key="mute" backgroundColor="MEDIUM_GRAY">
          <Typo type="body-medium" color="WHITE" textAlign="center">
            Mute
          </Typo>
        </StyledSwipeButton>,
        <StyledSwipeButton key="delete" backgroundColor="ERROR">
          <Typo type="body-medium" color="WHITE" textAlign="center">
            Delete
          </Typo>
        </StyledSwipeButton>,
      ]}
    >
      <Layout.FlexRow
        w="100%"
        justifyContent="space-between"
        gap={10}
        alignItems="center"
        ph={16}
        onMouseDown={handleClickItem}
      >
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
    </SwipeLayout>
  );
}
