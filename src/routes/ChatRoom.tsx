import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { MOCK_CHAT_ROOM_LIST } from '@components/chats/chat-room-list/ChatRoomList.helper';
import { HeaderWrapper } from '@components/header/Header.styled';
import Icon from '@components/header/icon/Icon';
import { Z_INDEX } from '@constants/layout';
import { Font, Layout } from '@design-system';

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

  const handleClickNotiSettings = () => {
    // TODO: notification setting modal
  };

  const handleClickMsgSearch = () => {
    // TODO: notification setting modal
  };

  return (
    <Layout.Fixed l={0} t={0} w="100%" h="100vh" z={Z_INDEX.MODAL_CONTAINER} bgColor="BASIC_WHITE">
      <HeaderWrapper>
        <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
          <Icon name="arrow_left" size={36} color="BASIC_BLACK" onClick={handleClickGoBack} />
          <Layout.FlexRow alignItems="center" gap={6.5}>
            <ProfileImage imageUrl={chatRoomData?.imageUrl} size={24} />
            <Font.Body type="20_semibold">{chatRoomData?.username}</Font.Body>
          </Layout.FlexRow>
          <Layout.FlexRow alignItems="center" gap={10}>
            <Icon name="search" size={18} fill="BASIC_BLACK" onClick={handleClickMsgSearch} />
            <Icon
              name="top_navigation_noti"
              size={36}
              color="BASIC_BLACK"
              onClick={handleClickNotiSettings}
            />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </HeaderWrapper>
      {chatRoomData ? 'message list' : 'no chat room'}
    </Layout.Fixed>
  );
}
