import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { MessageInputBox } from '@components/chat-room/message-input-box/MessageInputBox';
import { MessageList } from '@components/chat-room/message-list/MessageList';
import { MessageNotiSettingDialog } from '@components/chat-room/message-noti-setting-dialog/MessageNotiSettingDialog';
import { TOP_NAVIGATION_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ChatRoom as ChatRoomType, ResponseMessageAction } from '@models/api/chat';
import { MainWrapper } from '@styles/wrappers';
import { getChatMessages, getChatRoomInfo } from '@utils/apis/chat';
import { useChatRoomAutoScroll } from 'src/routes/chat-room/_hooks/useChatRoomAutoScroll';
import { useChatRoomSocketProvider } from 'src/routes/chat-room/_hooks/useChatRoomSocketProvider';
import { ChatRoomContainer, ChatRoomHeaderWrapper } from './ChatRoom.styled';

export function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [chatRoom, setChatRoom] = useState<ChatRoomType>();
  const [messages, setMessages] = useState<ResponseMessageAction[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const { scrollRef, setPrevScrollHeight } = useChatRoomAutoScroll(messages);

  const fetchChatRoomInfo = useCallback(async (id: string) => {
    const room = await getChatRoomInfo(id);
    setChatRoom(room);
  }, []);

  // 채팅방 목록에서 해당 채팅방 정보 얻기.
  useEffect(() => {
    if (!roomId) return;

    fetchChatRoomInfo(roomId);
  }, [fetchChatRoomInfo, roomId]);

  const fetchChatMessages = useCallback(
    async (_next?: string) => {
      if (!roomId) return;
      const { next, results = [] } = await getChatMessages(roomId, _next);
      const list = results.map((msg) => ({
        content: msg.content,
        userName: msg.sender.username,
        timestamp: msg.timestamp,
      }));

      setMessages((prev) => (_next ? (prev ? [...list, ...prev] : []) : list));
      setNextUrl(next);
    },
    [roomId],
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

  const onSocketMessage = useCallback((message: ResponseMessageAction) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const { sendSocketData } = useChatRoomSocketProvider({ roomId, onSocketMessage });

  const handleClickGoBack = () => {
    navigate('/chats');
  };

  const handleClickMsgSearch = () => {
    // TODO: notification setting modal
  };

  // TODO: 채팅방 뮤트 설정 반영
  const [isMuted, setIsMuted] = useState(false);
  const setMuteOn = () => setIsMuted(true);
  const setMuteOff = () => setIsMuted(false);

  const [showNotiSettingDialog, setShowNotiSettingDialog] = useState(false);
  const openNotiSettingDialog = () => setShowNotiSettingDialog(true);
  const closeNotiSettingDialog = () => setShowNotiSettingDialog(false);

  const handleClickNotiSetting = () => {
    if (isMuted) {
      setMuteOff();
      return;
    }
    openNotiSettingDialog();
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
            <Icon
              name={isMuted ? 'notification_mute' : 'notification'}
              size={36}
              color="BLACK"
              onClick={handleClickNotiSetting}
            />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </ChatRoomHeaderWrapper>
      <Layout.FlexCol w="100%" h="100%">
        <MainWrapper alignItems="center" pt={TOP_NAVIGATION_HEIGHT} ref={scrollRef}>
          <div ref={targetRef} />
          {isLoading && <Loader />}
          {chatRoom ? (
            <MessageList messages={messages} room={chatRoom} sendSocketData={sendSocketData} />
          ) : (
            'loading...'
          )}
        </MainWrapper>
        <Layout.LayoutBase w="100%" ph={17} pv={13}>
          <MessageInputBox participants={chatRoom?.participants} sendSocketData={sendSocketData} />
        </Layout.LayoutBase>
      </Layout.FlexCol>
      <MessageNotiSettingDialog
        visible={showNotiSettingDialog}
        onClickMute={setMuteOn}
        onClose={closeNotiSettingDialog}
      />
    </ChatRoomContainer>
  );
}
