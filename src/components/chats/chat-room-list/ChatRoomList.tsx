import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { ChatRoomItem } from '@components/chats/chat-room-list/ChatRoomItem';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBoundStore } from '@stores/useBoundStore';

export function ChatRoomList() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.room_list' });

  const { rooms, getChatRoomList } = useBoundStore((state) => ({
    rooms: state.chatRoomList,
    getChatRoomList: state.getChatRoomList,
  }));

  // TODO: pagination 추가
  const fetchChatRooms = useCallback(async () => {
    getChatRoomList();
  }, [getChatRoomList]);
  useAsyncEffect(fetchChatRooms, [fetchChatRooms]);

  return (
    <Layout.FlexCol w="100%" pv={5} gap={5}>
      <Layout.LayoutBase ph={16}>
        <Typo type="title-medium">{t('title')}</Typo>
      </Layout.LayoutBase>
      <Layout.FlexCol w="100%" gap={10}>
        <SwipeLayoutList>
          {/* TODO: 실제 데이터로 변경 */}
          {rooms.data?.map((room) => (
            <ChatRoomItem key={room.id} room={room} />
          ))}
        </SwipeLayoutList>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}
