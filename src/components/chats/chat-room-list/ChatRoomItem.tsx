import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import { Font, Layout, SvgIcon } from '@design-system';

interface Props {
  username: string;
  imageUrl: string;
  lastMessageTime: string;
  hasUnreadMessages: boolean;
}

export function ChatRoomItem({ username, imageUrl, lastMessageTime, hasUnreadMessages }: Props) {
  const lastMessage = 'This is a last message.';

  return (
    <SwipeLayout
      rightContent={
        <Layout.FlexRow w="100%" h="100%" alignItems="center">
          <StyledSwipeButton backgroundColor="MEDIUM_GRAY">
            <Font.Body type="12_regular" color="WHITE" textAlign="center">
              Mute
            </Font.Body>
          </StyledSwipeButton>
          <StyledSwipeButton backgroundColor="ERROR">
            <Font.Body type="12_regular" color="WHITE" textAlign="center">
              Delete
            </Font.Body>
          </StyledSwipeButton>
        </Layout.FlexRow>
      }
    >
      <Layout.FlexRow w="100%" justifyContent="space-between" gap={10} alignItems="center" ph={16}>
        <ProfileImage imageUrl={imageUrl} size={55} />
        <Layout.FlexCol w="100%" justifyContent="center" gap={5}>
          <Layout.FlexRow w="100%" justifyContent="space-between">
            <Font.Body type="12_semibold">{username}</Font.Body>
            <Font.Body type="12_semibold" color="MEDIUM_GRAY">
              {formatLastMessageTime(lastMessageTime)}
            </Font.Body>
          </Layout.FlexRow>
          <Layout.FlexRow w="100%" justifyContent="space-between">
            <Font.Body
              type={hasUnreadMessages ? '12_semibold' : '12_regular'}
              color={hasUnreadMessages ? 'BLACK' : 'MEDIUM_GRAY'}
            >
              {lastMessage}
            </Font.Body>
            {hasUnreadMessages && <SvgIcon name="green_dot" size={10} />}
          </Layout.FlexRow>
        </Layout.FlexCol>
      </Layout.FlexRow>
    </SwipeLayout>
  );
}
