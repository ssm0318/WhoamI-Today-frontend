import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { ToggleSwitch } from '@components/_common/toggle-switch/ToggleSwitch';
import ChatsHeader from '@components/header/chats-header/ChatsHeader';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ChatRoom } from '@models/chat';
import { useBoundStore } from '@stores/useBoundStore';
import { getChatRooms } from '@utils/apis/chat';
import { MainScrollContainer } from '../Root';
import { useChatListSocket } from './_hooks/useChatListSocket';

// Override the shared ToggleSwitch's checked colour for the unread filter.
const PurpleToggleWrapper = styled.div`
  & input:checked + .slider {
    background-color: #8700ff;
  }
`;

function ChatList() {
  const navigate = useNavigate();
  const currentUser = useBoundStore((state) => state.myProfile);
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
  const [unreadOnly, setUnreadOnly] = useState(false);
  // Browse mode can prefill the close-friends-only chat filter when a custom
  // mode (or "Just my people") sets `chats_close_only`. Mirrors how
  // FriendsList does this — derive the initial state from the active mode and
  // bump it on if the active mode changes mid-session.
  const browseModeForcesCloseFriends = useBoundStore(
    (state) => !!state.activeBrowseMode?.config.filters.chats_close_only,
  );
  const [closeFriendsOnly, setCloseFriendsOnly] = useState(browseModeForcesCloseFriends);
  useEffect(() => {
    if (browseModeForcesCloseFriends) setCloseFriendsOnly(true);
  }, [browseModeForcesCloseFriends]);
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const passesCloseFriend = (r: ChatRoom) => {
    if (!closeFriendsOnly) return true;
    if (!r.is_group) return r.opponent?.is_close_friend === true;
    const others = (r.members_detail || []).filter((m) => m.id !== currentUser?.id);
    if (others.length === 0) return false;
    const cfCount = others.filter((m) => m.is_close_friend).length;
    return cfCount / others.length >= 0.5;
  };

  const filteredRooms = rooms.filter(
    (r) => (unreadOnly ? (r.unread_count || 0) > 0 : true) && passesCloseFriend(r),
  );

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

      // Handle new message events — match by opponent_id (1-on-1) or room_id (group).
      // The backend returns rooms ordered by (pin_rank asc, last_message_time desc):
      // wit_bot pinned first, wit_admin second, then everything else by recency.
      // We keep that order; do NOT re-sort client-side, otherwise the system pins drift.
      setRooms((prev) => {
        const matchFn = data.is_group
          ? (r: ChatRoom) => r.is_group && r.id === data.room_id
          : (r: ChatRoom) => r.opponent?.id === data.opponent_id;
        const existing = prev.find(matchFn);
        if (existing) {
          return prev.map((r) =>
            matchFn(r)
              ? {
                  ...r,
                  last_message: data.last_message || r.last_message,
                  last_message_time: data.last_message_time || r.last_message_time,
                  unread_count: data.unread_count ?? r.unread_count,
                }
              : r,
          );
        }
        getChatRooms().then(({ results }) => setRooms(results || []));
        return prev;
      });
    },
    [],
  );

  useChatListSocket(onChatListUpdate);

  return (
    <>
      <ChatsHeader />
      <MainScrollContainer>
        {!loading && (
          <Layout.FlexRow
            w="100%"
            ph={16}
            pv={8}
            bgColor="WHITE"
            alignItems="center"
            justifyContent="space-between"
          >
            <Layout.FlexRow gap={10} alignItems="center">
              <PurpleToggleWrapper>
                <ToggleSwitch
                  type="small"
                  checked={unreadOnly}
                  onChange={() => setUnreadOnly((v) => !v)}
                />
              </PurpleToggleWrapper>
              <Typo type="body-medium" color="DARK_GRAY">
                {(() => {
                  const unreadCount = rooms.filter((r) => (r.unread_count || 0) > 0).length;
                  return `Unread Only${unreadCount ? ` (${unreadCount})` : ''}`;
                })()}
              </Typo>
            </Layout.FlexRow>
            {featureFlags?.chatCloseFriendsFilter && (
              // Close-friends toggle is a viewing affordance — preview-exempt
              // so the user can flip it while previewing a custom mode.
              <Layout.FlexRow gap={10} alignItems="center" data-preview-exempt>
                <PurpleToggleWrapper>
                  <ToggleSwitch
                    type="small"
                    checked={closeFriendsOnly}
                    onChange={() => setCloseFriendsOnly((v) => !v)}
                  />
                </PurpleToggleWrapper>
                <Typo type="body-medium" color="DARK_GRAY">
                  Close Friends Only
                </Typo>
              </Layout.FlexRow>
            )}
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
        {!loading && rooms.length > 0 && filteredRooms.length === 0 && (
          <Layout.FlexCol w="100%" alignItems="center" mt={50}>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {closeFriendsOnly && !unreadOnly
                ? 'No close-friend chats.'
                : closeFriendsOnly && unreadOnly
                ? 'No unread close-friend chats.'
                : 'No unread chats.'}
            </Typo>
          </Layout.FlexCol>
        )}
        {!loading &&
          filteredRooms.map((room) => {
            // After wit_admin leaves an escalated wit_bot chat, the room stays
            // is_group=True with members shrunk to {user, wit_bot}. Render that
            // demoted shape as a plain wit_bot 1-on-1 (single avatar, no count).
            const witBotMember =
              room.is_group && room.members_detail?.length === 2
                ? room.members_detail.find((m) => m.username === 'wit_bot')
                : undefined;
            const renderAsWitBotDM = !!witBotMember;

            const opponentId = room.is_group ? null : room.opponent?.id;
            const isTyping = opponentId ? !!typingUsers[opponentId] : false;
            const roomName = witBotMember
              ? witBotMember.username
              : room.is_group
              ? room.name || 'Group Chat'
              : room.opponent?.username || 'Chat';
            const chatUrl =
              renderAsWitBotDM || room.is_group
                ? `/chats/group/${room.id}`
                : `/users/${opponentId}/chat`;
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
                {witBotMember ? (
                  <ProfileImage imageUrl={witBotMember.profile_image} size={44} />
                ) : room.is_group ? (
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
                    {room.is_group && !renderAsWitBotDM && room.members_detail && (
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
    </>
  );
}

export default ChatList;
