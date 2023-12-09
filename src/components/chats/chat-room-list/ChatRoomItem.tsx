import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { SwipeLayoutListContext } from '@components/_common/swipe-layout/SwipeLayoutList';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import { Layout, SvgIcon, Typo } from '@design-system';

interface Props {
  roomId: number;
  username: string;
  imageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  hasUnreadMessages: boolean;
}

export function ChatRoomItem({
  roomId,
  username,
  imageUrl,
  lastMessage,
  lastMessageTime,
  hasUnreadMessages,
}: Props) {
  const navigate = useNavigate();

  const { hasSwipedItem } = useContext(SwipeLayoutListContext);

  const handleClickItem = () => {
    if (hasSwipedItem) return;
    navigate(`/chats/${roomId}`);
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
        <ProfileImage imageUrl={imageUrl} size={55} />
        <Layout.FlexCol w="100%" justifyContent="center" gap={5}>
          <Layout.FlexRow w="100%" justifyContent="space-between">
            <Typo type="label-large">{username}</Typo>
            <Typo type="label-small" color="MEDIUM_GRAY">
              {formatLastMessageTime(lastMessageTime)}
            </Typo>
          </Layout.FlexRow>
          <Layout.FlexRow w="100%" justifyContent="space-between">
            <Typo
              type={hasUnreadMessages ? 'label-medium' : 'body-small'}
              color={hasUnreadMessages ? 'BLACK' : 'MEDIUM_GRAY'}
            >
              {lastMessage}
            </Typo>

            {hasUnreadMessages && <SvgIcon name="green_dot" size={10} />}
          </Layout.FlexRow>
        </Layout.FlexCol>
      </Layout.FlexRow>
    </SwipeLayout>
  );
}
