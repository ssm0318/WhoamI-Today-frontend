import { isSameDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import ChatMessageInput from '@components/chat/chat-message-input/ChatMessageInput';
import ChatMessageItem from '@components/chat/chat-message-item/ChatMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { CHAT_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import {
  ChatMessage,
  MessageReactionSummary,
  PostChatMessageRes,
  RefinedChatMessage,
} from '@models/chat';
import { useBoundStore } from '@stores/useBoundStore';
import { getChatMessages, markMessagesRead } from '@utils/apis/chat';
import { getMyProfile } from '@utils/apis/my';
import { MainScrollContainer } from '../Root';
import { useChatSocketProvider } from './_hooks/useChatSocketProvider';

function Chat() {
  const { username: userId } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToMessageId = (location.state as { scrollToMessageId?: number })?.scrollToMessageId;
  const [t] = useTranslation('translation', { keyPrefix: 'chat' });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);

  const currentUser = useBoundStore((state) => state.myProfile);

  const fetchMessages = useCallback(async (_userId: number) => {
    const { next, results, username: _username } = await getChatMessages(_userId);
    setUsername(_username ?? '');
    if (!results) {
      setNextUrl(next);
      setMessages([]);
      setFirstLoad(false);
      return;
    }
    setMessages([...results].reverse());
    setNextUrl(next);
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchMessages(Number(userId));
  }, [fetchMessages, userId]);

  // Scroll to target message or bottom on first load
  useEffect(() => {
    if (firstLoad) return;
    if (scrollToMessageId) {
      const el = document.getElementById(`msg_${scrollToMessageId}`);
      if (el) {
        el.scrollIntoView({ block: 'center' });
        el.style.backgroundColor = '#F3E8FF';
        setTimeout(() => {
          el.style.backgroundColor = '';
        }, 2000);
        return;
      }
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [firstLoad, scrollToMessageId]);

  const refinedMessages = useMemo((): RefinedChatMessage[] => {
    return messages.reduce<RefinedChatMessage[]>((acc, curr) => {
      const last = acc[acc.length - 1];
      if (!last || !isSameDay(new Date(last.created_at), new Date(curr.created_at))) {
        acc.push({ ...curr, show_date: true });
      } else {
        acc.push(curr);
      }
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
    setPrevScrollHeight(scrollRef.current?.clientHeight);
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
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

        setPrevScrollHeight(scrollRef.current?.clientHeight);
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, { ...msg, is_read: true }];
        });
        if (userId) {
          markMessagesRead(Number(userId)).catch(() => {});
        }
      }
    },
    [currentUser, userId],
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

  const { sendTyping } = useChatSocketProvider({
    userId: userId ? Number(userId) : undefined,
    onMessage: onSocketMessage,
    onReaction: onSocketReaction,
    onTyping: onSocketTyping,
  });

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={markRead} style={{ width: '100%' }}>
        <SubHeader title={username} onClickTitle={() => navigate(`/users/${username}`)} />
        {firstLoad && (
          <Layout.FlexCol w="100%" alignItems="center" mt={30}>
            <Loader />
          </Layout.FlexCol>
        )}
        {!firstLoad && refinedMessages.length > 0 && (
          <SwipeLayoutList>
            <Layout.FlexCol w="100%" gap={15} p={10} mb={CHAT_MESSAGE_INPUT_HEIGHT}>
              <div ref={targetRef} />
              {isLoading && <Loader />}
              {refinedMessages.map((message) => (
                <SwipeLayout
                  key={message.id}
                  leftContent={[
                    <Layout.FlexRow
                      key="reply"
                      w={50}
                      h="100%"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => setReplyTarget(message)}
                    >
                      <Icon name="arrow_left" size={20} color="MEDIUM_GRAY" />
                    </Layout.FlexRow>,
                  ]}
                >
                  <ChatMessageItem
                    message={message}
                    isMine={
                      currentUser ? Number(message.sender.id) === Number(currentUser.id) : false
                    }
                  />
                </SwipeLayout>
              ))}
            </Layout.FlexCol>
          </SwipeLayoutList>
        )}
        {!firstLoad && refinedMessages.length === 0 && (
          <Layout.FlexCol w="100%" h="100%" alignItems="center" mt={50}>
            <Layout.FlexRow>
              <span style={{ fontSize: 14, color: '#A0A0A0' }}>{t('no_messages')}</span>
            </Layout.FlexRow>
          </Layout.FlexCol>
        )}
      </div>
      {isOpponentTyping && (
        <Layout.Fixed
          b={145}
          z={11}
          style={{ left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 500 }}
        >
          <Layout.FlexRow pl={17} pv={4}>
            <Typo type="body-small" color="MEDIUM_GRAY">
              {username} is typing...
            </Typo>
          </Layout.FlexRow>
        </Layout.Fixed>
      )}
      <ChatMessageInput
        userId={Number(userId)}
        replyTarget={replyTarget}
        onClearReply={() => setReplyTarget(null)}
        onMessageSent={handleMessageSent}
        onTyping={sendTyping}
      />
    </MainScrollContainer>
  );
}

export default Chat;
