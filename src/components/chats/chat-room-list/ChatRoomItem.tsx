import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
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
    <Layout.FlexRow w="100%" justifyContent="space-between" gap={10} alignItems="center">
      <ProfileImage imageUrl={imageUrl} size={55} />
      <Layout.FlexCol w="100%" justifyContent="center" gap={5}>
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Font.Body type="12_semibold">{username}</Font.Body>
          <Font.Body type="12_semibold" color="GRAY_12">
            {formatLastMessageTime(lastMessageTime)}
          </Font.Body>
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Font.Body
            type={hasUnreadMessages ? '12_semibold' : '12_regular'}
            color={hasUnreadMessages ? 'BASIC_BLACK' : 'GRAY_12'}
          >
            {lastMessage}
          </Font.Body>
          {hasUnreadMessages && <SvgIcon name="green_dot" size={10} />}
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
