import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { MessageInputBox } from '@components/chat-room/message-input-box/MessageInputBox';
import { MessageList } from '@components/chat-room/message-list/MessageList';
import { MessageNotiSettings } from '@components/chat-room/message-noti-settings/MessageNotiSettings';
import { MOCK_CHAT_ROOM_LIST } from '@components/chats/chat-room-list/ChatRoomList.helper';
import Icon from '@components/header/icon/Icon';
import { TOP_NAVIGATION_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { MainWrapper } from '@styles/wrappers';
import { ChatRoomContainer, ChatRoomHeaderWrapper } from './ChatRoom.styled';

export function ChatRoom() {
  const { roomId: roomIdStr } = useParams();
  const navigate = useNavigate();

  // TODO: 채팅방 입장시 메시지 읽음 처리

  const handleClickGoBack = () => {
    navigate('/chats');
  };

  const chatRoomData = useMemo(() => {
    if (!roomIdStr) return;
    const roomId = parseInt(roomIdStr, 10);
    // FIXME: 채팅방 정보 얻기
    const chatRoom = MOCK_CHAT_ROOM_LIST.find((chat) => chat.roomId === roomId);
    return chatRoom;
  }, [roomIdStr]);

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
          <Layout.FlexRow alignItems="center" gap={6.5}>
            <ProfileImage imageUrl={chatRoomData?.imageUrl} size={24} />
            <Typo type="title-large">{chatRoomData?.username}</Typo>
          </Layout.FlexRow>
          <Layout.FlexRow alignItems="center" gap={10}>
            <Icon name="search" size={18} fill="BLACK" onClick={handleClickMsgSearch} />
            <Icon name="notification" size={36} color="BLACK" onClick={handleClickNotiSettings} />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </ChatRoomHeaderWrapper>
      <Layout.FlexCol w="100%" h="100%">
        <MainWrapper alignItems="center" pt={TOP_NAVIGATION_HEIGHT}>
          {chatRoomData ? <MessageList /> : 'loading...'}
        </MainWrapper>
        <Layout.LayoutBase w="100%" ph={17} pv={13}>
          <MessageInputBox />
        </Layout.LayoutBase>
      </Layout.FlexCol>
      <MessageNotiSettings visible={settingsVisible} onClose={handleOnCloseSettingsModal} />
    </ChatRoomContainer>
  );
}