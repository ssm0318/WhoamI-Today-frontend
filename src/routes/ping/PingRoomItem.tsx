import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { formatLastMessageTime } from '@components/chats/chat-room-list/ChatRoomItem.helper';
import { Layout, Typo } from '@design-system';
import { PingEmojiDict, PingEmojiType, PingRoom } from '@models/ping';

interface Props {
  room: PingRoom;
}

function getLastMessagePreview(emoji: string | undefined, content: string): string {
  const emojiStr = emoji && emoji in PingEmojiDict ? PingEmojiDict[emoji as PingEmojiType] : '';
  return [emojiStr, content].filter(Boolean).join(' ') || '—';
}

export function PingRoomItem({ room }: Props) {
  const navigate = useNavigate();
  const opponent = room?.opponent;

  const handleClick = useCallback(() => {
    if (opponent) navigate(`/users/${opponent.id}/ping`);
  }, [navigate, opponent]);

  if (!opponent) return null;

  const displayName = opponent.username?.toLowerCase() === 'me' ? '—' : opponent.username ?? '—';
  const hasUnread = (opponent.unread_count ?? 0) > 0;
  const preview = getLastMessagePreview(room.last_ping_emoji, room.last_message ?? '');

  return (
    <Layout.FlexRow
      w="100%"
      pv={12}
      gap={16}
      justifyContent="space-between"
      alignItems="center"
      onMouseDown={handleClick}
    >
      <ProfileImage imageUrl={opponent.profile_image} size={55} username={opponent.username} />
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
                  {(opponent.unread_count ?? 0) > 99 ? '99+' : opponent.unread_count}
                </Typo>
              </Layout.LayoutBase>
            )}
          </Layout.FlexRow>
          {room.last_message_time && (
            <Typo type="label-small" color="MEDIUM_GRAY">
              {formatLastMessageTime(room.last_message_time)}
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
