import { AxiosError } from 'axios';
import { isSameDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeToReply } from '@components/_common/swipe-to-reply/SwipeToReply';
import ChatMessageInput from '@components/chat/chat-message-input/ChatMessageInput';
import ChatMessageItem from '@components/chat/chat-message-item/ChatMessageItem';
import {
  LeftMessageWrapper,
  SenderAvatarSlot,
  TypingBubble,
  TypingDot,
} from '@components/chat/chat-message-item/ChatMessageItem.styled';
import ChatRequestBar from '@components/chat/chat-request-bar/ChatRequestBar';
import SideMenu from '@components/header/side-menu/SideMenu';
import SubHeader from '@components/sub-header/SubHeader';
import { CHAT_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import {
  BotButton,
  ChatMessage,
  MessageReactionSummary,
  PostChatMessageRes,
  RefinedChatMessage,
} from '@models/chat';
import { useBoundStore } from '@stores/useBoundStore';
import { getChatMessages, markMessagesRead, postChatMessage } from '@utils/apis/chat';
import { getMyProfile } from '@utils/apis/my';
import { getUserProfile } from '@utils/apis/user';
import { MainScrollContainer } from '../Root';
import { useChatSocketProvider } from './_hooks/useChatSocketProvider';
import { getWitBotReplyRevealDelay } from './_utils/witBotReplyPacing';

const NEAR_BOTTOM_PX = 120;

// Insert a message into the list at its chronological position. Both REST
// (postChatMessage response) and WebSocket (incoming) paths use this so a
// race between bot reply WS push and user-message REST resolution can't
// reorder the bubbles.
function insertChronologically<T extends { id: number; created_at: string }>(
  list: T[],
  msg: T,
): T[] {
  if (list.some((m) => m.id === msg.id)) return list;
  const ts = new Date(msg.created_at).getTime();
  let i = list.length;
  while (i > 0 && new Date(list[i - 1].created_at).getTime() > ts) i -= 1;
  if (i === list.length) return [...list, msg];
  return [...list.slice(0, i), msg, ...list.slice(i)];
}

interface PendingBotReply {
  message: ChatMessage;
  revealIndex: number;
}

function WitBotTypingIndicator({ sender }: { sender: ChatMessage['sender'] }) {
  return (
    <LeftMessageWrapper aria-label={`${sender.username} is typing`}>
      <SenderAvatarSlot>
        <ProfileImage size={32} imageUrl={sender.profile_image} username={sender.username} />
      </SenderAvatarSlot>
      <Layout.FlexCol ml={6}>
        <TypingBubble>
          <TypingDot />
          <TypingDot />
          <TypingDot />
        </TypingBubble>
      </Layout.FlexCol>
    </LeftMessageWrapper>
  );
}

function Chat() {
  const { username: userId } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToMessageId = (location.state as { scrollToMessageId?: number })?.scrollToMessageId;
  const [t] = useTranslation('translation', { keyPrefix: 'chat' });

  const scrollRef = useRef<HTMLDivElement>(null);
  const composeWrapperRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();
  const justSentIdsRef = useRef<Set<number>>(new Set());
  const shouldPinToBottomRef = useRef<Set<number>>(new Set());
  const markReadTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // Track the live compose-input height. Defaults to the regular-chat
  // constant; ResizeObserver below updates it to match the actual rendered
  // height (announcement compose is ~162px and grows as the user types
  // multi-line). The messages container's bottom margin uses this so the
  // last bubble never gets covered by the compose box.
  const [composeHeight, setComposeHeight] = useState<number>(CHAT_MESSAGE_INPUT_HEIGHT);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [pendingBotReplies, setPendingBotReplies] = useState<PendingBotReply[]>([]);
  const [typingBotSender, setTypingBotSender] = useState<ChatMessage['sender'] | null>(null);

  const [areFriends, setAreFriends] = useState<boolean | null>(null);
  const [sentChatRequest, setSentChatRequest] = useState(false);
  const [receivedChatRequestId, setReceivedChatRequestId] = useState<number | null>(null);
  const [acceptedChatRequest, setAcceptedChatRequest] = useState(false);

  const currentUser = useBoundStore((state) => state.myProfile);
  const openToast = useBoundStore((state) => state.openToast);

  const loadRelationship = useCallback(async (profileUsername: string) => {
    if (!profileUsername) return;
    try {
      const profile = await getUserProfile(profileUsername);
      setAreFriends(profile.are_friends === true);
      setSentChatRequest(profile.sent_chat_request_to === true);
      setReceivedChatRequestId(profile.received_chat_request_from ?? null);
      setAcceptedChatRequest(profile.accepted_chat_request === true);
    } catch {
      setAreFriends(true);
    }
  }, []);

  const fetchMessages = useCallback(
    async (_userId: number) => {
      try {
        const { next, results, username: _username } = await getChatMessages(_userId);
        const resolvedUsername = _username ?? '';
        setUsername(resolvedUsername);
        if (resolvedUsername) loadRelationship(resolvedUsername);
        if (!results) {
          setNextUrl(next);
          setMessages([]);
          setFirstLoad(false);
          return;
        }
        setMessages([...results].reverse());
        setNextUrl(next);
        setFirstLoad(false);
      } catch (err) {
        const axiosErr = err as AxiosError;
        if (axiosErr?.response?.status === 403) {
          openToast({ message: t('send_blocked') });
          navigate(-1);
        }
        setFirstLoad(false);
      }
    },
    [loadRelationship, navigate, openToast, t],
  );

  useEffect(() => {
    if (!userId) return;
    fetchMessages(Number(userId));
    return () => {
      clearTimeout(markReadTimerRef.current);
    };
  }, [fetchMessages, userId]);

  // Track the live compose-input height. Announcement compose is much taller
  // than regular chat (~162px baseline, can grow to 360px+) and grows further
  // when the user types multi-line. Without this the bottom of the chat gets
  // covered by the compose box and the last message looks truncated.
  //
  // ChatMessageInput's root is `position: fixed`, which means our wrapping div
  // has 0 flow height. Observe the fixed child (firstElementChild) instead:
  // it has a real getBoundingClientRect even though it doesn't take flow.
  // Re-runs when `username` changes (announcement vs. regular swaps the
  // compose component); ResizeObserver handles textarea autosize within a
  // session.
  useEffect(() => {
    const wrapper = composeWrapperRef.current;
    if (!wrapper) return undefined;
    const target = wrapper.firstElementChild as HTMLElement | null;
    if (!target) return undefined;
    const update = () => {
      const h = target.getBoundingClientRect().height;
      if (h > 0) setComposeHeight(h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(target);
    return () => ro.disconnect();
  }, [username]);

  // Scroll to target message or pin to bottom on first load
  useEffect(() => {
    if (firstLoad) return undefined;
    if (scrollToMessageId) {
      const el = document.getElementById(`msg_${scrollToMessageId}`);
      if (el) {
        el.scrollIntoView({ block: 'center' });
        el.style.backgroundColor = '#F3E8FF';
        setTimeout(() => {
          el.style.backgroundColor = '';
        }, 2000);
        return undefined;
      }
    }
    const el = scrollRef.current;
    if (!el) return undefined;

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
  }, [firstLoad, scrollToMessageId]);

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
    if (nextUrl && userId) {
      setPrevScrollHeight(scrollRef.current?.scrollHeight);
      const { next, results } = await getChatMessages(Number(userId), nextUrl);
      setNextUrl(next);
      if (!results) {
        setIsLoading(false);
        return;
      }
      setMessages((prev) => [...[...results].reverse(), ...prev]);
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
    const botReplies = newMsg.bot_replies ?? [];
    justSentIdsRef.current.add(newMsg.id);
    setPrevScrollHeight(scrollRef.current?.clientHeight);
    setMessages((prev) => {
      return insertChronologically(prev, newMsg);
    });
    if (botReplies.length) {
      setPendingBotReplies((prev) => [
        ...prev,
        ...botReplies.map((reply, index) => ({
          message: { ...reply, is_read: true },
          revealIndex: index,
        })),
      ]);
    }
  };

  useEffect(() => {
    if (!pendingBotReplies.length) {
      setTypingBotSender(null);
      return undefined;
    }

    const nextReply = pendingBotReplies[0];
    setTypingBotSender(nextReply.message.sender);
    const timerId = setTimeout(() => {
      justSentIdsRef.current.add(nextReply.message.id);
      setPrevScrollHeight(scrollRef.current?.clientHeight);
      setMessages((prev) => insertChronologically(prev, nextReply.message));
      setPendingBotReplies((prev) => prev.slice(1));
    }, getWitBotReplyRevealDelay(nextReply.message, nextReply.revealIndex));

    return () => clearTimeout(timerId);
  }, [pendingBotReplies]);

  useEffect(() => {
    if (!typingBotSender || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [typingBotSender, pendingBotReplies.length]);

  const handleBotButtonClick = useCallback(
    async (button: BotButton) => {
      if (button.action === 'navigate' && button.url) {
        navigate(button.url);
        return;
      }
      if (button.action === 'external' && button.url) {
        window.open(button.url, '_blank', 'noopener,noreferrer');
        return;
      }
      if (button.action === 'reply' && userId) {
        try {
          const { data } = await postChatMessage(Number(userId), {
            emoji: '',
            content: button.label,
            bot_payload: { kind: 'choice', payload: button.payload },
          });
          handleMessageSent(data);
          if (button.payload === 'admin' && data.chat_room_id) {
            navigate(`/chats/group/${data.chat_room_id}`, { replace: true });
          }
        } catch {
          // Silent — matches existing chat send-error pattern.
        }
      }
    },
    [navigate, userId],
  );

  const handleBotMultiSelectSubmit = useCallback(
    async (intent: string, selected: string[]) => {
      if (!userId) return;
      try {
        const { data } = await postChatMessage(Number(userId), {
          emoji: '',
          content: 'multi-select submitted',
          bot_payload: { kind: 'multi_select_response', intent, selected },
        });
        handleMessageSent(data);
      } catch {
        // Silent.
      }
    },
    [userId],
  );

  const handleBotUploadSubmit = useCallback(
    async (file: File, context?: string) => {
      if (!userId) return;
      try {
        const { data } = await postChatMessage(
          Number(userId),
          {
            emoji: '',
            content: 'screenshot uploaded',
            bot_payload: { kind: 'upload_response', context },
          },
          file,
        );
        handleMessageSent(data);
      } catch {
        // Silent.
      }
    },
    [userId],
  );

  const handleImageLoaded = (messageId: number) => {
    const shouldScroll =
      justSentIdsRef.current.has(messageId) || shouldPinToBottomRef.current.has(messageId);
    if (!shouldScroll || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    justSentIdsRef.current.delete(messageId);
    shouldPinToBottomRef.current.delete(messageId);
  };

  // Mark messages as read on page entry and on any click/tap
  const markRead = useCallback(() => {
    if (!userId) return;
    markMessagesRead(Number(userId))
      .then(() => getMyProfile())
      .catch(() => {});
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
  }, [userId]);

  useEffect(() => {
    if (!userId || firstLoad) return;
    markRead();
  }, [userId, firstLoad, markRead]);

  // WebSocket: receive messages from the other user
  const onSocketMessage = useCallback(
    (msg: PostChatMessageRes) => {
      if (currentUser && Number(msg.sender?.id) !== Number(currentUser.id)) {
        // Clear typing indicator since they sent a message
        setIsOpponentTyping(false);
        clearTimeout(typingTimerRef.current);

        const el = scrollRef.current;
        const isNearBottom = el
          ? el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
          : true;
        if (isNearBottom) shouldPinToBottomRef.current.add(msg.id);

        setPrevScrollHeight(scrollRef.current?.clientHeight);
        setMessages((prev) => insertChronologically(prev, { ...msg, is_read: true }));
        if (userId) {
          clearTimeout(markReadTimerRef.current);
          markReadTimerRef.current = setTimeout(markRead, 300);
        }
      }
    },
    [currentUser, markRead, userId],
  );

  // WebSocket: receive reaction updates
  const onSocketReaction = useCallback(
    (data: { action: string; message_id: number; reactions: MessageReactionSummary[] }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === data.message_id ? { ...m, reactions: data.reactions } : m)),
      );
    },
    [],
  );

  // Typing indicator
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const onSocketTyping = useCallback(() => {
    setIsOpponentTyping(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setIsOpponentTyping(false), 3000);
  }, []);

  const onFriendshipBroken = useCallback(() => {
    setAreFriends(false);
    setSentChatRequest(false);
    setReceivedChatRequestId(null);
  }, []);

  const { sendTyping } = useChatSocketProvider({
    userId: userId ? Number(userId) : undefined,
    onMessage: onSocketMessage,
    onReaction: onSocketReaction,
    onTyping: onSocketTyping,
    onFriendshipBroken,
  });

  const showRequestBar = areFriends === false && !acceptedChatRequest;

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={markRead} style={{ width: '100%' }}>
        <SubHeader
          title={username}
          onClickTitle={() => navigate(`/users/${username}`)}
          RightComponent={<Icon name="hamburger" size={44} onClick={() => setShowSideMenu(true)} />}
        />
        {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
        {firstLoad && (
          <Layout.FlexCol w="100%" alignItems="center" mt={30}>
            <Loader />
          </Layout.FlexCol>
        )}
        {!firstLoad && refinedMessages.length > 0 && (
          <Layout.FlexCol w="100%" gap={15} p={10} mb={showRequestBar ? 110 : composeHeight}>
            <div ref={targetRef} />
            {isLoading && <Loader />}
            {refinedMessages.map((message) => (
              <SwipeToReply key={message.id} onReply={() => setReplyTarget(message)}>
                <ChatMessageItem
                  message={message}
                  isMine={
                    currentUser ? Number(message.sender.id) === Number(currentUser.id) : false
                  }
                  isFirstInCluster={message.is_first_in_cluster}
                  onImageLoad={handleImageLoaded}
                  onBotButtonClick={handleBotButtonClick}
                  onBotMultiSelectSubmit={handleBotMultiSelectSubmit}
                  onBotUploadSubmit={handleBotUploadSubmit}
                />
              </SwipeToReply>
            ))}
            {pendingBotReplies.length > 0 && typingBotSender && (
              <WitBotTypingIndicator sender={typingBotSender} />
            )}
          </Layout.FlexCol>
        )}
        {!firstLoad && refinedMessages.length === 0 && (
          <Layout.FlexCol w="100%" h="100%" alignItems="center" mt={50}>
            <Layout.FlexRow>
              <span style={{ fontSize: 14, color: '#A0A0A0' }}>{t('no_messages')}</span>
            </Layout.FlexRow>
          </Layout.FlexCol>
        )}
      </div>
      {showRequestBar ? (
        <ChatRequestBar
          userId={Number(userId)}
          sentRequest={sentChatRequest}
          receivedRequestId={receivedChatRequestId}
          onRequestSent={() => setSentChatRequest(true)}
          onAccepted={() => {
            if (username) loadRelationship(username);
          }}
          onDeclined={() => navigate(-1)}
          onCancelled={() => setSentChatRequest(false)}
        />
      ) : (
        <div ref={composeWrapperRef}>
          <ChatMessageInput
            userId={Number(userId)}
            replyTarget={replyTarget}
            onClearReply={() => setReplyTarget(null)}
            onMessageSent={handleMessageSent}
            onTyping={sendTyping}
            typingText={isOpponentTyping ? `${username} is typing...` : null}
            isAnnouncement={username === 'Announcements'}
          />
        </div>
      )}
    </MainScrollContainer>
  );
}

export default Chat;
