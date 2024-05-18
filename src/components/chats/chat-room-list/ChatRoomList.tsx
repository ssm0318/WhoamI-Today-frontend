import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
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
  checkList?: Set<number>;
  onClickCheckBox?: (roomId: number) => void;
}

export function ChatRoomList({ isEditMode, checkList, onClickCheckBox }: Props) {
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
        const sortedResults = results.sort((a, b) => {
          const aTime = new Date(a.last_message_time).getTime();
          const bTime = new Date(b.last_message_time).getTime();
          return bTime - aTime;
        });
        setRooms({ state: 'hasValue', data: sortedResults });
        setNextUrl(next);
      } catch {
        setRooms({ state: 'hasError' });
      }
    },
    [setRooms],
  );
  useAsyncEffect(fetchChatRoomList, [fetchChatRoomList]);

  const infiniteCallback = useCallback(async () => {
    if (nextUrl) {
      await fetchChatRoomList(nextUrl);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChatRoomList, nextUrl]);
  const { isLoading, targetRef, setIsLoading } =
    useInfiniteScroll<HTMLDivElement>(infiniteCallback);

  return (
    <Layout.FlexCol w="100%" h="100%" pv={5} gap={10}>
      <Layout.LayoutBase ph={16}>
        <Typo type="title-medium">{t('title')}</Typo>
      </Layout.LayoutBase>
      {rooms.state === 'loading' && <Loader />}
      {rooms.data &&
        (rooms.data.length === 0 ? (
          <Layout.FlexCol w="100%" ph={16}>
            <NoContents text={t('no_contents')} />
          </Layout.FlexCol>
        ) : (
          <Layout.FlexCol w="100%" gap={8}>
            {isEditMode ? (
              <>
                {rooms.data.map((room) => (
                  <ChatRoomItem
                    key={room.id}
                    room={room}
                    isEditMode={isEditMode}
                    checkList={checkList}
                    onClickCheckBox={onClickCheckBox}
                  />
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
        ))}
    </Layout.FlexCol>
  );
}
