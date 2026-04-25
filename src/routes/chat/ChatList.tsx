import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ChatRoom } from '@models/chat';
import { getChatRooms } from '@utils/apis/chat';
import { MainScrollContainer } from '../Root';
import { useChatListSocket } from './_hooks/useChatListSocket';

function ChatList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
  const [unreadOnly, setUnreadOnly] = useState(false);
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useAsyncEffect(async () => {
    const { results } = await getChatRooms();
    setRooms(results || []);
    setLoading(false);
  }, []);

  const onChatListUpdate = useCallback(
    (data: {
      action?: string;
      opponent_id?: number;
      room_id?: number;
      is_group?: boolean;
      username?: string;
      last_message?: string;
      last_message_time?: string;
      unread_count?: number;
    }) => {
      // Handle typing events
      if (data.action === 'typing' && data.username && data.opponent_id) {
        const key = data.opponent_id;
        setTypingUsers((prev) => ({ ...prev, [key]: data.username as string }));
        clearTimeout(typingTimers.current[key]);
        typingTimers.current[key] = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }, 3000);
        return;
      }

      // Handle new message events — match by opponent_id (1-on-1) or room_id (group)
      setRooms((prev) => {
        const matchFn = data.is_group
          ? (r: ChatRoom) => r.is_group && r.id === data.room_id
          : (r: ChatRoom) => r.opponent?.id === data.opponent_id;
        const existing = prev.find(matchFn);
        if (existing) {
          const updated = prev.map((r) =>
            matchFn(r)
              ? {
                  ...r,
                  last_message: data.last_message || r.last_message,
                  last_message_time: data.last_message_time || r.last_message_time,
                  unread_count: data.unread_count ?? r.unread_count,
                }
              : r,
          );
          updated.sort(
            (a, b) =>
              new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime(),
          );
          return updated;
        }
        getChatRooms().then(({ results }) => setRooms(results || []));
        return prev;
      });
    },
    [],
  );

  useChatListSocket(onChatListUpdate);

  return (
    <MainScrollContainer>
      <SubHeader
        title="Chats"
        LeftComponent={<Layout.LayoutBase w={36} h={36} />}
        RightComponent={
          <Layout.FlexRow gap={4} alignItems="center">
            <Icon name="search_black" size={38} onClick={() => navigate('/chats/search')} />
            <Icon name="group_chat_new" size={38} onClick={() => navigate('/chats/new-group')} />
          </Layout.FlexRow>
        }
      />
      {!loading && (
        <Layout.FlexRow w="100%" ph={16} pv={8} gap={8} bgColor="WHITE">
          {(() => {
            const unreadCount = rooms.filter((r) => (r.unread_count || 0) > 0).length;
            return (
              <button
                type="button"
                onClick={() => setUnreadOnly((v) => !v)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: `1px solid ${unreadOnly ? '#8700FF' : '#D9D9D9'}`,
                  background: unreadOnly ? '#F3E8FF' : 'white',
                  color: unreadOnly ? '#8700FF' : '#333',
                  fontSize: 14,
                  fontWeight: unreadOnly ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {`Unread Only${unreadCount ? ` (${unreadCount})` : ''}`}
              </button>
            );
          })()}
        </Layout.FlexRow>
      )}
      {loading && (
        <Layout.FlexCol w="100%" alignItems="center" mt={30}>
          <Loader />
        </Layout.FlexCol>
      )}
      {!loading && rooms.length === 0 && (
        <Layout.FlexCol w="100%" alignItems="center" mt={50}>
          <Typo type="body-medium" color="MEDIUM_GRAY">
            No conversations yet.
          </Typo>
        </Layout.FlexCol>
      )}
      {!loading &&
        rooms.length > 0 &&
        rooms.filter((r) => (unreadOnly ? (r.unread_count || 0) > 0 : true)).length === 0 && (
          <Layout.FlexCol w="100%" alignItems="center" mt={50}>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              No unread chats.
            </Typo>
          </Layout.FlexCol>
        )}
      {!loading &&
        rooms
          .filter((r) => (unreadOnly ? (r.unread_count || 0) > 0 : true))
          .map((room) => {
            const opponentId = room.is_group ? null : room.opponent?.id;
            const isTyping = opponentId ? !!typingUsers[opponentId] : false;
            const roomName = room.is_group
              ? room.name || 'Group Chat'
              : room.opponent?.username || 'Chat';
            const chatUrl = room.is_group ? `/chats/group/${room.id}` : `/users/${opponentId}/chat`;
            return (
              <Layout.FlexRow
                key={room.id}
                w="100%"
                ph={16}
                pv={12}
                gap={12}
                alignItems="center"
                cursor="pointer"
                onClick={() => navigate(chatUrl)}
                style={{ borderBottom: '1px solid #F0F0F0' }}
              >
                {room.is_group ? (
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: '#F0F0F0',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridTemplateRows: '1fr 1fr',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {(room.members_detail || []).slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        style={{
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        {m.profile_image ? (
                          <img
                            src={m.profile_image}
                            alt={m.username}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              background: '#D9D9D9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                            }}
                          >
                            {m.username[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ProfileImage imageUrl={room.opponent?.profile_image} size={44} />
                )}
                <Layout.FlexCol style={{ flex: 1, minWidth: 0 }}>
                  <Layout.FlexRow gap={6} alignItems="center">
                    <Typo type="title-medium" color="BLACK">
                      {roomName}
                    </Typo>
                    {room.is_group && room.members_detail && (
                      <Typo type="label-small" color="MEDIUM_GRAY">
                        ({room.members_detail.length})
                      </Typo>
                    )}
                  </Layout.FlexRow>
                  {isTyping ? (
                    <Typo type="body-small" color="PRIMARY">
                      typing...
                    </Typo>
                  ) : (
                    room.last_message && (
                      <Typo type="body-small" color="MEDIUM_GRAY">
                        {room.last_message}
                      </Typo>
                    )
                  )}
                </Layout.FlexCol>
                {room.unread_count > 0 && (
                  <Layout.FlexRow
                    ph={8}
                    pv={2}
                    rounded={10}
                    alignItems="center"
                    justifyContent="center"
                    bgColor="SECONDARY"
                    style={{ minWidth: 24 }}
                  >
                    <Typo type="label-small" color="BLACK">
                      {room.unread_count > 99 ? '99+' : room.unread_count}
                    </Typo>
                  </Layout.FlexRow>
                )}
              </Layout.FlexRow>
            );
          })}
    </MainScrollContainer>
  );
}

export default ChatList;
