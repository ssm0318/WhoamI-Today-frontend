import { useTranslation } from 'react-i18next';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { ChatRoomItem } from '@components/chats/chat-room-list/ChatRoomItem';
import { MOCK_CHAT_ROOM_LIST } from '@components/chats/chat-room-list/ChatRoomList.helper';
import { Font, Layout } from '@design-system';

export function ChatRoomList() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.room_list' });

  return (
    <Layout.FlexCol w="100%" pv={5} gap={5}>
      <Layout.LayoutBase ph={16}>
        <Font.Body type="16_semibold">{t('title')}</Font.Body>
      </Layout.LayoutBase>
      <Layout.FlexCol w="100%" gap={10}>
        <SwipeLayoutList>
          {/* TODO: 실제 데이터로 변경 */}
          {MOCK_CHAT_ROOM_LIST.map((props) => (
            <ChatRoomItem key={props.roomId} {...props} />
          ))}
        </SwipeLayoutList>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}
