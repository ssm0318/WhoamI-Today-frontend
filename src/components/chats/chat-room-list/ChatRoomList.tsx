import { useTranslation } from 'react-i18next';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { ChatRoomItem } from '@components/chats/chat-room-list/ChatRoomItem';
import { Layout, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { SwipeableChatRoomItem } from './SwipeableChatRoomItem';

interface Props {
  isEditMode?: boolean;
  checkList?: Set<number>;
  onClickCheckBox?: (roomId: number) => void;
}

export function ChatRoomList({ isEditMode, checkList, onClickCheckBox }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.room_list' });

  const { rooms } = useBoundStore((state) => ({
    rooms: state.chatRoomList,
    setRooms: state.setChatRoomList,
  }));

  // TODO: BE에서 chat api 머지 후 주석 해제
  // const [nextUrl, setNextUrl] = useState<string | null>(null);

  // const fetchChatRoomList = useCallback(
  //   async (_next?: string) => {
  //     try {
  //       const { results = [], next } = await getChatRooms(_next);
  //       setRooms({ state: 'hasValue', data: results });
  //       setNextUrl(next);
  //     } catch {
  //       setRooms({ state: 'hasError' });
  //     }
  //   },
  //   [setRooms],
  // );
  // useAsyncEffect(fetchChatRoomList, [fetchChatRoomList]);

  // const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
  //   if (nextUrl) {
  //     await fetchChatRoomList(nextUrl);
  //     setIsLoading(false);
  //     return;
  //   }
  //   setIsLoading(false);
  // });

  return (
    <Layout.FlexCol w="100%" h="100%" pv={5} gap={10}>
      <Layout.LayoutBase ph={16}>
        <Typo type="title-medium">{t('title')}</Typo>
      </Layout.LayoutBase>
      {rooms.data && (
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
          {/* <div ref={targetRef} />
        {isLoading && <Loader />} */}
        </Layout.FlexCol>
      )}
    </Layout.FlexCol>
  );
}
