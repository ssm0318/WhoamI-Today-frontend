import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { ChatRoomItem } from '@components/chats/chat-room-list/ChatRoomItem';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBoundStore } from '@stores/useBoundStore';
import { getChatRooms } from '@utils/apis/chat';

export function ChatRoomList() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.room_list' });

  const { rooms, setRooms } = useBoundStore((state) => ({
    rooms: state.chatRoomList,
    setRooms: state.setChatRoomList,
  }));

  // TODO: pagination 추가
  const fetchChatRooms = useCallback(async () => {
    const chatRoomList = await getChatRooms();
    setRooms(chatRoomList);
  }, [setRooms]);
  useAsyncEffect(fetchChatRooms, [fetchChatRooms]);

  return (
    <Layout.FlexCol w="100%" pv={5} gap={5}>
      <Layout.LayoutBase ph={16}>
        <Typo type="title-medium">{t('title')}</Typo>
      </Layout.LayoutBase>
      <Layout.FlexCol w="100%" gap={10}>
        <SwipeLayoutList>
          {/* TODO: 실제 데이터로 변경 */}
          {rooms.map((room) => (
            <ChatRoomItem key={room.id} room={room} />
          ))}
        </SwipeLayoutList>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}
