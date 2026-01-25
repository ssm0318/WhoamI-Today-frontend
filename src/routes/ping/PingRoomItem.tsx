import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { Layout, Typo } from '@design-system';
import { PingEmojiDict, PingEmojiType, PingRoom } from '@models/ping';

interface Props {
  room: PingRoom;
  currentUserId: number;
}

function getLastMessagePreview(emoji: string, content: string): string {
  const emojiStr = emoji && emoji in PingEmojiDict ? PingEmojiDict[emoji as PingEmojiType] : '';
  return [emojiStr, content].filter(Boolean).join(' ') || '—';
}

export function PingRoomItem({ room, currentUserId }: Props) {
  const navigate = useNavigate();
  const otherUser = room.user1.id === currentUserId ? room.user2 : room.user1;
  const displayName = otherUser.username?.toLowerCase() === 'me' ? '—' : otherUser.username ?? '—';
  const hasUnread = room.unread_cnt > 0;
  const preview = getLastMessagePreview(room.last_ping_emoji, room.last_ping_content);

  const handleClick = useCallback(() => {
    navigate(`/users/${otherUser.id}/ping`);
  }, [navigate, otherUser.id]);

  return (
    <Layout.FlexRow
      w="100%"
      gap={16}
      justifyContent="space-between"
      alignItems="center"
      onMouseDown={handleClick}
    >
      <ProfileImage imageUrl={otherUser.profile_image} size={55} username={otherUser.username} />
      <Layout.FlexCol w="100%" justifyContent="center" gap={5}>
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Layout.FlexRow gap={4} alignItems="center">
            <Typo type="label-large">{displayName}</Typo>
            {hasUnread && (
              <Layout.LayoutBase
                ph={6}
                pv={2}
                rounded={10}
                style={{ background: 'var(--color-primary)', minWidth: 18 }}
              >
                <Typo type="label-small" color="WHITE">
                  {room.unread_cnt > 99 ? '99+' : room.unread_cnt}
                </Typo>
              </Layout.LayoutBase>
            )}
          </Layout.FlexRow>
          {room.last_ping_time && (
            <Typo type="label-small" color="MEDIUM_GRAY">
              {formatLastMessageTime(room.last_ping_time)}
            </Typo>
          )}
        </Layout.FlexRow>
        <Typo
          type={hasUnread ? 'label-medium' : 'body-small'}
          color={hasUnread ? 'BLACK' : 'MEDIUM_GRAY'}
          numberOfLines={1}
        >
          {preview}
        </Typo>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
