import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { MessageInputBox } from '@components/chat-room/message-input-box/MessageInputBox';
import { MessageList } from '@components/chat-room/message-list/MessageList';
import { MessageNotiSettings } from '@components/chat-room/message-noti-settings/MessageNotiSettings';
import Icon from '@components/header/icon/Icon';
import { TOP_NAVIGATION_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
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

  const fetchChatMessages = useCallback(async () => {
    if (!chatRoom) return;
    const data = await getChatMessages(chatRoom.id);
    const list = data.map((msg) => ({
      message: msg.content,
      userName: msg.sender.username,
      timestamp: msg.timestamp,
    }));
    setMessages(list);
  }, [chatRoom]);
  useAsyncEffect(fetchChatMessages, [fetchChatMessages]);

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

  // TODO: 채팅방 입장시 메시지 읽음 처리

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
        <MainWrapper alignItems="center" pt={TOP_NAVIGATION_HEIGHT}>
          {chatRoom ? <MessageList messages={messages} room={chatRoom} /> : 'loading...'}
        </MainWrapper>
        <Layout.LayoutBase w="100%" ph={17} pv={13}>
          <MessageInputBox chatSocket={chatSocket} />
        </Layout.LayoutBase>
      </Layout.FlexCol>
      <MessageNotiSettings visible={settingsVisible} onClose={handleOnCloseSettingsModal} />
    </ChatRoomContainer>
  );
}
