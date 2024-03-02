import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { ChatRoomItem } from '@components/chats/chat-room-list/ChatRoomItem';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { useBoundStore } from '@stores/useBoundStore';
import { getChatRooms } from '@utils/apis/chat';
import { SwipeableChatRoomItem } from './SwipeableChatRoomItem';

interface Props {
  isEditMode?: boolean;
}

export function ChatRoomList({ isEditMode }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.room_list' });

  const { rooms, setRooms } = useBoundStore((state) => ({
    rooms: state.chatRoomList,
    setRooms: state.setChatRoomList,
  }));

  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchChatRoomList = useCallback(
    async (_next?: string) => {
      try {
        const { results = [], next } = await getChatRooms(_next);
        setRooms({ state: 'hasValue', data: results });
        setNextUrl(next);
      } catch {
        setRooms({ state: 'hasError' });
      }
    },
    [setRooms],
  );
  useAsyncEffect(fetchChatRoomList, [fetchChatRoomList]);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) {
      await fetchChatRoomList(nextUrl);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  });

  return (
    <Layout.FlexCol w="100%" h="100%" pv={5} gap={5}>
      <Layout.LayoutBase ph={16}>
        <Typo type="title-medium">{t('title')}</Typo>
      </Layout.LayoutBase>
      {rooms.data && (
        <Layout.FlexCol w="100%" gap={10}>
          {isEditMode ? (
            <>
              {rooms.data.map((room) => (
                <ChatRoomItem key={room.id} room={room} isEditMode={isEditMode} />
              ))}
            </>
          ) : (
            <SwipeLayoutList>
              {rooms.data.map((room) => (
                <SwipeableChatRoomItem key={room.id} room={room} />
              ))}
            </SwipeLayoutList>
          )}
          <div ref={targetRef} />
          {isLoading && <Loader />}
        </Layout.FlexCol>
      )}
    </Layout.FlexCol>
  );
}
