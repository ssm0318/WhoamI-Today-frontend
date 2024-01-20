import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { MessageInputBox } from '@components/chat-room/message-input-box/MessageInputBox';
import { MessageList } from '@components/chat-room/message-list/MessageList';
import { MessageNotiSettings } from '@components/chat-room/message-noti-settings/MessageNotiSettings';
import Icon from '@components/header/icon/Icon';
import { TOP_NAVIGATION_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ChatRoom as ChatRoomType, SocketMessage } from '@models/api/chat';
import { useBoundStore } from '@stores/useBoundStore';
import { MainWrapper } from '@styles/wrappers';
import { getChatMessages } from '@utils/apis/chat';
import { ChatRoomContainer, ChatRoomHeaderWrapper } from './ChatRoom.styled';

const chatHost = 'localhost:8000';

export function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { chatRoomList } = useBoundStore((state) => ({
    chatRoomList: state.chatRoomList,
  }));

  const [chatRoom, setChatRoom] = useState<ChatRoomType>();
  // 채팅방 목록에서 해당 채팅방 정보 얻기.
  useEffect(() => {
    if (!roomId || chatRoomList.state !== 'hasValue') return;
    const room = chatRoomList.data.find(({ id }) => id.toString() === roomId);
    if (!room) return;
    setChatRoom(room);
  }, [chatRoomList, roomId]);

  const chatSocket = useRef<WebSocket>();

  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();

  const fetchChatMessages = useCallback(
    async (_next?: string) => {
      if (!chatRoom) return;
      const { next, results = [] } = await getChatMessages(chatRoom.id, _next);
      const list = results.map((msg) => ({
        message: msg.content,
        userName: msg.sender.username,
        timestamp: msg.timestamp,
      }));

      setMessages((prev) => (_next ? (prev ? [...list, ...prev] : []) : list));
      setNextUrl(next);
    },
    [chatRoom],
  );
  useAsyncEffect(fetchChatMessages, [fetchChatMessages]);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) {
      setPrevScrollHeight(scrollRef.current?.scrollHeight);
      await fetchChatMessages(nextUrl);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  });

  const addEventListenerToSocket = useCallback((socket: WebSocket) => {
    socket.addEventListener('message', (e) => {
      const message = JSON.parse(e.data);
      console.log('message', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.addEventListener('open', (e) => {
      console.log('socket has been opened', e);
    });

    socket.addEventListener('close', (e) => {
      console.log('socket has been closed', e);
    });
  }, []);

  useEffect(() => {
    if (!chatRoom) return;

    const socket = new WebSocket(`ws://${chatHost}/ws/chat/${chatRoom.id}/`);

    addEventListenerToSocket(socket);
    chatSocket.current = socket;

    return () => {
      socket.close();
    };
  }, [addEventListenerToSocket, chatRoom, fetchChatMessages]);

  const handleClickGoBack = () => {
    navigate('/chats');
  };

  const handleClickMsgSearch = () => {
    // TODO: notification setting modal
  };

  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleClickNotiSettings = () => {
    setSettingsVisible(true);
  };

  const handleOnCloseSettingsModal = () => {
    setSettingsVisible(false);
  };

  // 스크롤 위치 유지
  useEffect(() => {
    if (!scrollRef.current) return;

    if (prevScrollHeight) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(undefined);
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <ChatRoomContainer
      t={0}
      w="100%"
      h="100%"
      z={Z_INDEX.MODAL_CONTAINER}
      bgColor="WHITE"
      alignItems="center"
    >
      <ChatRoomHeaderWrapper>
        <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
          <Icon name="arrow_left" size={36} color="BLACK" onClick={handleClickGoBack} />
          {chatRoom && (
            <Layout.FlexRow alignItems="center" gap={6.5}>
              <ProfileImage imageUrl={chatRoom.participants[0].profile_image} size={24} />
              <Typo type="title-large">{chatRoom.participants[0].username}</Typo>
            </Layout.FlexRow>
          )}
          <Layout.FlexRow alignItems="center" gap={10}>
            <Icon name="search" size={18} fill="BLACK" onClick={handleClickMsgSearch} />
            <Icon name="notification" size={36} color="BLACK" onClick={handleClickNotiSettings} />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </ChatRoomHeaderWrapper>
      <Layout.FlexCol w="100%" h="100%">
        <MainWrapper alignItems="center" pt={TOP_NAVIGATION_HEIGHT} ref={scrollRef}>
          <div ref={targetRef} />
          {isLoading && <Loader />}
          {chatRoom ? <MessageList messages={messages} room={chatRoom} /> : 'loading...'}
          <div ref={bottomRef} />
        </MainWrapper>
        <Layout.LayoutBase w="100%" ph={17} pv={13}>
          <MessageInputBox chatSocket={chatSocket} />
        </Layout.LayoutBase>
      </Layout.FlexCol>
      <MessageNotiSettings visible={settingsVisible} onClose={handleOnCloseSettingsModal} />
    </ChatRoomContainer>
  );
}
