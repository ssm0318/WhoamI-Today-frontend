import { isSameDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeToReply } from '@components/_common/swipe-to-reply/SwipeToReply';
import ChatMessageInput from '@components/chat/chat-message-input/ChatMessageInput';
import ChatMessageItem from '@components/chat/chat-message-item/ChatMessageItem';
import SideMenu from '@components/header/side-menu/SideMenu';
import { CHAT_MESSAGE_INPUT_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import {
  ChatMessage,
  ChatRoom,
  ChatRoomMember,
  PostChatMessageRes,
  RefinedChatMessage,
} from '@models/chat';
import { useBoundStore } from '@stores/useBoundStore';
import axios from '@utils/apis/axios';
import {
  dismissWitAdmin,
  getGroupMessages,
  leaveGroupChat,
  markGroupMessagesRead,
  updateGroupChat,
} from '@utils/apis/chat';
import { getMyProfile } from '@utils/apis/my';
import { MainScrollContainer } from '../Root';

const NEAR_BOTTOM_PX = 120;

function getGroupWsUrl(roomId: number, token: string) {
  if (process.env.NODE_ENV === 'development') {
    return `ws://localhost:8000/ws/chat/group/${roomId}/?token=${token}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}/ws/chat/group/${roomId}/?token=${token}`;
}

function GroupChat() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();
  const justSentIdsRef = useRef<Set<number>>(new Set());
  const shouldPinToBottomRef = useRef<Set<number>>(new Set());
  const markReadTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom>();
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const socketRef = useRef<WebSocket>();

  const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useBoundStore((state) => state.myProfile);

  useEffect(() => {
    if (!roomId) return;
    axios
      .get<ChatRoom>(`/chat/groups/${roomId}/`)
      .then(({ data }) => {
        setRoom(data);
        setEditName(data.name || 'Group Chat');
      })
      .catch(() => {});
  }, [roomId]);

  const fetchMessages = useCallback(async (id: number) => {
    const { next, results } = await getGroupMessages(id);
    // Mark all fetched messages as read locally (user is viewing them now)
    const msgs = results ? [...results].reverse().map((m) => ({ ...m, is_read: true })) : [];
    setMessages(msgs);
    setNextUrl(next);
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    fetchMessages(Number(roomId));
    return () => {
      clearTimeout(markReadTimerRef.current);
    };
  }, [fetchMessages, roomId]);

  useEffect(() => {
    if (firstLoad || !scrollRef.current) return undefined;
    const el = scrollRef.current;

    // Stay pinned to the bottom while late-loading images/fonts shift layout.
    // Re-pin on every resize unconditionally; bail out only if the user scrolls up.
    let pinning = true;
    const pin = () => {
      if (!pinning) return;
      el.scrollTop = el.scrollHeight;
    };
    pin();
    const onUserScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distFromBottom > 50) pinning = false;
    };
    el.addEventListener('scroll', onUserScroll, { passive: true });
    const observer = new ResizeObserver(pin);
    observer.observe(el);
    const inner = el.firstElementChild;
    if (inner) observer.observe(inner);
    const stopId = setTimeout(() => {
      pinning = false;
      observer.disconnect();
      el.removeEventListener('scroll', onUserScroll);
    }, 3000);
    return () => {
      pinning = false;
      observer.disconnect();
      el.removeEventListener('scroll', onUserScroll);
      clearTimeout(stopId);
    };
  }, [firstLoad]);

  // Mark messages as read on page entry
  const markRead = useCallback(() => {
    if (!roomId) return;
    markGroupMessagesRead(Number(roomId))
      .then(() => getMyProfile())
      .catch(() => {});
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
  }, [roomId]);

  useEffect(() => {
    if (!roomId || firstLoad) return;
    markRead();
  }, [roomId, firstLoad, markRead]);

  // WebSocket
  useEffect(() => {
    if (!roomId) return;
    const token = document.cookie
      .split('; ')
      .find((c) => c.startsWith('access_token='))
      ?.split('=')[1];
    if (!token) return;

    const ws = new WebSocket(getGroupWsUrl(Number(roomId), token));
    ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'typing') {
        if (currentUser && data.user_id !== currentUser.id) {
          setTypingUsers((prev) => ({ ...prev, [data.user_id]: data.username }));
          clearTimeout(typingTimers.current[data.user_id]);
          typingTimers.current[data.user_id] = setTimeout(() => {
            setTypingUsers((prev) => {
              const next = { ...prev };
              delete next[data.user_id];
              return next;
            });
          }, 3000);
        }
      } else if (data.action === 'reaction') {
        setMessages((prev) =>
          prev.map((m) => (m.id === data.message_id ? { ...m, reactions: data.reactions } : m)),
        );
      } else if (data.event_type === 'member_added' || data.event_type === 'member_left') {
        // System messages flow to every member (including the actor) so the
        // header member count, member drawer, and message list stay in sync
        // without a refetch.
        const targets: ChatRoomMember[] = data.event_target_users ?? [];
        setRoom((prev) => {
          if (!prev) return prev;
          const current = prev.members_detail ?? [];
          if (data.event_type === 'member_added') {
            const existing = new Set(current.map((m) => m.id));
            return {
              ...prev,
              members_detail: [...current, ...targets.filter((u) => !existing.has(u.id))],
            };
          }
          const removeIds = new Set(targets.map((u) => u.id));
          return {
            ...prev,
            members_detail: current.filter((m) => !removeIds.has(m.id)),
          };
        });
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, { ...data, is_read: true }];
        });
      } else if (currentUser && Number(data.sender?.id) !== Number(currentUser.id)) {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[data.sender.id];
          return next;
        });
        const el = scrollRef.current;
        const isNearBottom = el
          ? el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
          : true;
        if (isNearBottom) shouldPinToBottomRef.current.add(data.id);
        setPrevScrollHeight(scrollRef.current?.clientHeight);
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, { ...data, is_read: true }];
        });
        // Mark as read since user is viewing the room
        if (roomId) {
          clearTimeout(markReadTimerRef.current);
          markReadTimerRef.current = setTimeout(markRead, 300);
        }
      }
    });
    socketRef.current = ws;
    return () => {
      ws.close();
    };
  }, [roomId, currentUser, markRead]);

  const sendTyping = useCallback(() => {
    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'typing' }));
    }
  }, []);

  const refinedMessages = useMemo((): RefinedChatMessage[] => {
    return messages.reduce<RefinedChatMessage[]>((acc, curr) => {
      const last = acc[acc.length - 1];
      const showDate = !last || !isSameDay(new Date(last.created_at), new Date(curr.created_at));
      const isFirstInCluster =
        !last ||
        !!last.event_type ||
        !!curr.event_type ||
        Number(last.sender.id) !== Number(curr.sender.id) ||
        showDate;
      acc.push({ ...curr, show_date: showDate, is_first_in_cluster: isFirstInCluster });
      return acc;
    }, []);
  }, [messages]);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl && roomId) {
      setPrevScrollHeight(scrollRef.current?.scrollHeight);
      const { next, results } = await getGroupMessages(Number(roomId), nextUrl);
      setNextUrl(next);
      if (!results) {
        setIsLoading(false);
        return;
      }
      setMessages((prev) => [
        ...[...results].reverse().map((m) => ({ ...m, is_read: true })),
        ...prev,
      ]);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  });

  useEffect(() => {
    if (!scrollRef.current || !prevScrollHeight) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
    setPrevScrollHeight(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleMessageSent = (newMsg: PostChatMessageRes) => {
    justSentIdsRef.current.add(newMsg.id);
    setPrevScrollHeight(scrollRef.current?.clientHeight);
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
  };

  const handleImageLoaded = (messageId: number) => {
    const shouldScroll =
      justSentIdsRef.current.has(messageId) || shouldPinToBottomRef.current.has(messageId);
    if (!shouldScroll || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    justSentIdsRef.current.delete(messageId);
    shouldPinToBottomRef.current.delete(messageId);
  };

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleSaveName = async () => {
    setIsEditingName(false);
    const groupTitle = room?.name || 'Group Chat';
    if (editName.trim() && editName !== groupTitle && roomId) {
      await updateGroupChat(Number(roomId), { name: editName.trim() });
      setRoom((prev) => (prev ? { ...prev, name: editName.trim() } : prev));
    }
  };

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleLeave = async () => {
    if (!roomId) return;
    await leaveGroupChat(Number(roomId));
    navigate('/chats');
  };

  const groupTitle = room?.name || 'Group Chat';
  const members = room?.members_detail || [];
  const typingNames = Object.values(typingUsers);
  // wit_bot escalated room: 3-member group containing wit_bot. The user can
  // dismiss wit_admin via the per-member Remove button (separate from Leave,
  // which actually removes the user themselves like in any group chat).
  const witBotMember = members.find((m) => m.username === 'wit_bot');
  const witAdminMember = members.find((m) => m.username === 'wit_admin');
  const isWitBotEscalated = !!witBotMember && !!witAdminMember;

  const handleDismissAdmin = async () => {
    if (!roomId || !witBotMember) return;
    try {
      const { data } = await dismissWitAdmin(Number(roomId));
      if (data?.status === 'admin_dismissed' && data?.redirect_user_id) {
        navigate(`/users/${data.redirect_user_id}/chat`, { replace: true });
      }
    } catch {
      // Silent — match existing chat error pattern.
    }
  };

  return (
    <MainScrollContainer scrollRef={scrollRef} style={{ marginTop: 0 }}>
      {/* Custom header: back | centered title + pencil | members icon */}
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        ph="default"
        pv={4}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'white',
          borderBottom: '1px solid #F0F0F0',
          height: TOP_NAVIGATION_HEIGHT,
        }}
      >
        {/* Left: back arrow */}
        <Layout.LayoutBase w={36} h={36}>
          <button
            type="button"
            onClick={() => navigate('/chats')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Icon name="arrow_left" size={36} color="BLACK" />
          </button>
        </Layout.LayoutBase>

        {/* Center: title + pencil (or edit input) */}
        <Layout.FlexRow style={{ flex: 1 }} justifyContent="center" alignItems="center" gap={4}>
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
              }}
              onBlur={handleSaveName}
              style={{
                width: '70%',
                fontSize: 18,
                fontWeight: 700,
                border: 'none',
                borderBottom: '1.5px solid #000',
                outline: 'none',
                fontFamily: 'inherit',
                padding: '2px 4px',
                textAlign: 'center',
                background: 'transparent',
              }}
            />
          ) : (
            <>
              <Typo type="title-large">{groupTitle}</Typo>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M10.5 1.75L12.25 3.5L3.5 12.25H1.75V10.5L10.5 1.75Z"
                    stroke="#000"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </Layout.FlexRow>

        {/* Right: members + hamburger */}
        <Layout.FlexRow alignItems="center" justifyContent="flex-end" gap={4}>
          <button
            type="button"
            onClick={() => setShowMemberDrawer(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: 0,
            }}
          >
            <EmojiItem emojiString="👤" size={16} bgColor="TRANSPARENT" outline="TRANSPARENT" />
            <span style={{ fontSize: 12, color: '#666', lineHeight: 1 }}>{members.length}</span>
          </button>
          <Icon name="hamburger" size={44} onClick={() => setShowSideMenu(true)} />
        </Layout.FlexRow>
      </Layout.FlexRow>
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}

      {/* Right-side member drawer */}
      {showMemberDrawer && (
        <>
          {/* Backdrop — constrained to app width */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            onClick={() => setShowMemberDrawer(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 500,
              height: '100%',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          />
          {/* Drawer — right-aligned within app width */}
          <Layout.FlexCol
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              marginLeft: Math.min(window.innerWidth, 500) / 2 - 260,
              width: 260,
              height: '100%',
              background: 'white',
              zIndex: 1000,
              boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
              padding: '16px 0',
            }}
          >
            <Layout.FlexRow
              w="100%"
              ph={16}
              pv={8}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typo type="title-medium">Members</Typo>
              <button
                type="button"
                onClick={() => setShowMemberDrawer(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              >
                ✕
              </button>
            </Layout.FlexRow>
            {/* Add member button */}
            <Layout.FlexRow
              w="100%"
              ph={16}
              pv={10}
              gap={10}
              alignItems="center"
              cursor="pointer"
              onClick={() => {
                setShowMemberDrawer(false);
                navigate(`/chats/group/${roomId}/add-members`);
              }}
              style={{ borderBottom: '1px solid #F0F0F0' }}
            >
              <Layout.FlexRow
                w={32}
                h={32}
                rounded={16}
                bgColor="LIGHT"
                alignItems="center"
                justifyContent="center"
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              </Layout.FlexRow>
              <Typo type="body-medium" color="PRIMARY">
                Add Member
              </Typo>
            </Layout.FlexRow>
            {/* Member list — clickable to profile */}
            <Layout.FlexCol w="100%" style={{ flex: 1, overflowY: 'auto' }}>
              {members.map((m) => {
                const showRemoveAdmin =
                  isWitBotEscalated &&
                  m.username === 'wit_admin' &&
                  !!currentUser &&
                  Number(currentUser.id) !== Number(m.id);
                return (
                  <Layout.FlexRow
                    key={m.id}
                    gap={10}
                    alignItems="center"
                    ph={16}
                    pv={8}
                    cursor="pointer"
                    onClick={() => {
                      setShowMemberDrawer(false);
                      navigate(`/users/${m.username}`);
                    }}
                  >
                    <ProfileImage imageUrl={m.profile_image} size={32} />
                    <Typo type="body-medium" color="BLACK">
                      {m.username}
                    </Typo>
                    {currentUser && Number(m.id) === Number(currentUser.id) && (
                      <Typo type="label-small" color="MEDIUM_GRAY">
                        (you)
                      </Typo>
                    )}
                    {showRemoveAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissAdmin();
                        }}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: '1px solid #FF3B30',
                          color: '#FF3B30',
                          borderRadius: 8,
                          padding: '4px 10px',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </Layout.FlexRow>
                );
              })}
            </Layout.FlexCol>
            <Layout.FlexCol w="100%" ph={16} pv={12} gap={8}>
              {showLeaveConfirm ? (
                <>
                  <Typo type="body-small" color="BLACK">
                    Are you sure you want to leave this group?
                  </Typo>
                  <Layout.FlexRow gap={12}>
                    <button
                      type="button"
                      onClick={handleLeave}
                      style={{
                        background: '#FF3B30',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Leave
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeaveConfirm(false)}
                      style={{
                        background: '#F0F0F0',
                        color: '#333',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 16px',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </Layout.FlexRow>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Typo type="label-medium" color="WARNING">
                    Leave Group
                  </Typo>
                </button>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </>
      )}

      {firstLoad && (
        <Layout.FlexCol w="100%" alignItems="center" mt={30}>
          <Loader />
        </Layout.FlexCol>
      )}
      {!firstLoad && refinedMessages.length > 0 && (
        <Layout.FlexCol w="100%" gap={15} p={10} mb={CHAT_MESSAGE_INPUT_HEIGHT}>
          <div ref={targetRef} />
          {isLoading && <Loader />}
          {refinedMessages.map((message) => {
            const isMine = currentUser
              ? Number(message.sender.id) === Number(currentUser.id)
              : false;
            const isSystem =
              message.event_type === 'member_added' || message.event_type === 'member_left';
            return (
              <Layout.FlexCol key={message.id} w="100%">
                {isSystem ? (
                  <ChatMessageItem
                    message={message}
                    isMine={isMine}
                    isFirstInCluster={message.is_first_in_cluster}
                    showSenderName
                    onImageLoad={handleImageLoaded}
                  />
                ) : (
                  <SwipeToReply onReply={() => setReplyTarget(message)}>
                    <ChatMessageItem
                      message={message}
                      isMine={isMine}
                      isFirstInCluster={message.is_first_in_cluster}
                      showSenderName
                      onImageLoad={handleImageLoaded}
                    />
                  </SwipeToReply>
                )}
              </Layout.FlexCol>
            );
          })}
        </Layout.FlexCol>
      )}
      {!firstLoad && refinedMessages.length === 0 && (
        <Layout.FlexCol w="100%" alignItems="center" mt={50}>
          <Typo type="body-medium" color="MEDIUM_GRAY">
            No messages yet. Say hi!
          </Typo>
        </Layout.FlexCol>
      )}

      <ChatMessageInput
        userId={Number(roomId)}
        replyTarget={replyTarget}
        onClearReply={() => setReplyTarget(null)}
        onMessageSent={handleMessageSent}
        onTyping={sendTyping}
        isGroup
        typingText={
          typingNames.length === 0
            ? null
            : typingNames.length === 1
            ? `${typingNames[0]} is typing...`
            : typingNames.length === 2
            ? `${typingNames[0]} and ${typingNames[1]} are typing...`
            : `${typingNames[0]} and ${typingNames.length - 1} others are typing...`
        }
      />
    </MainScrollContainer>
  );
}

export default GroupChat;
