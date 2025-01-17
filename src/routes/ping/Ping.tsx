import { useEffect, useMemo, useRef } from 'react';
import Loader from '@components/_common/loader/Loader';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { MainScrollContainer } from '../Root';

const isLoading = false;
const isLoadingMore = false;
const pings = [
  {
    next: null,
    previous: null,
    count: 10,
    results: [
      {
        id: 1,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-03-02T18:41:09.769419+09:00',
      },
      {
        id: 2,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-03-01T09:00:09.769419+09:00',
      },
      {
        id: 3,
        sender: { id: 1, username: 'me', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-03-01T08:31:09.769419+09:00',
      },
      {
        id: 4,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-03-01T01:10:09.769419+09:00',
      },
      {
        id: 5,
        sender: { id: 1, username: 'me', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-02-28T12:41:09.769419+09:00',
      },
      {
        id: 6,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-02-27T20:41:09.769419+09:00',
      },
      {
        id: 7,
        sender: { id: 1, username: 'me', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-02-27T10:41:09.769419+09:00',
      },
      {
        id: 8,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-02-27T09:41:09.769419+09:00',
      },
      {
        id: 9,
        sender: { id: 1, username: 'me', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-02-26T14:41:09.769419+09:00',
      },
      {
        id: 10,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test',
        emoji: '',
        is_read: true,
        created_at: '2024-02-26T14:40:09.769419+09:00',
      },
    ],
  },
];

function Ping() {
  // const { user } = useContext(UserPageContext);

  // const userId = useMemo(() => {
  //   if (user.state !== 'hasValue' || !user.data) return;
  //   return user.data.id;
  // }, [user.data, user.state]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initScrollRef = useRef(false);
  const prevScrollHeightRef = useRef<number>();

  // const beforeInfiniteLoad = () => {
  //   if (!scrollRef.current) return;
  //   console.log('set prev scroll height', scrollRef.current.scrollHeight);
  //   prevScrollHeightRef.current = scrollRef.current.scrollHeight;
  // };

  // const {
  //   targetRef,
  //   data: pings,
  //   isLoading,
  //   isLoadingMore,
  //   mutate: refetchPings,
  // } = useSWRInfiniteScroll<PingMessage>({
  //   key: userId ? `/ping/user/${userId}/` : '',
  //   beforeInfiniteLoad,
  // });

  const handleClickRefresh = () => {
    // refetchPings();
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    if (pings && pings.length > 0) {
      console.log('scroll info', {
        scrollHeight: scrollRef.current.scrollHeight,
        clientHeight: scrollRef.current.clientHeight,
      });

      if (!initScrollRef.current) {
        scrollRef.current.scrollTop =
          scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      } else if (prevScrollHeightRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeightRef.current;

      // 처음 로딩시 발생하는 스크롤
      if (
        (scrollRef.current.scrollHeight === scrollRef.current.clientHeight &&
          !pings[pings.length - 1].next) ||
        (scrollRef.current.scrollHeight > scrollRef.current.clientHeight &&
          pings[pings.length - 1].next)
      ) {
        initScrollRef.current = true;
      }
    }
  }, []);

  useEffect(() => {
    console.log('pings', pings);
  }, []);

  const sortedPings = useMemo(() => {
    if (!pings) return;
    return [...pings].reverse().map((ping) => {
      if (!ping.results) return ping;
      return { ...ping, results: [...ping.results].reverse() };
    });
  }, []);

  useEffect(() => {
    console.log('sortedPings', sortedPings);
  }, [sortedPings]);

  // TODO: 스타일 반영, 다국어 추가
  return (
    <MainScrollContainer
      scrollRef={scrollRef}
      onScroll={(e) => {
        const { scrollHeight, scrollTop } = e.target as HTMLDivElement;
        console.log('scroll', { scrollHeight, scrollTop });
      }}
    >
      {/** title */}
      <SubHeader
        title="Ping!"
        RightComponent={
          <button type="button" onClick={handleClickRefresh}>
            <Typo type="title-medium" color="PRIMARY">
              Refresh
            </Typo>
          </button>
        }
      />
      {/** ping list */}
      {isLoading ? (
        <Loader />
      ) : (
        sortedPings?.[0] &&
        sortedPings[0].count > 0 && (
          <Layout.FlexCol w="100%" gap={10} p={10} mb={PING_MESSAGE_INPUT_HEIGHT}>
            {/* <div ref={targetRef} /> */}
            {isLoadingMore && <Loader />}
            {sortedPings.map(({ results }) =>
              results?.map((message) => {
                return <PingMessageItem key={message.id} message={message} />;
              }),
            )}
          </Layout.FlexCol>
        )
      )}
      {/** ping input */}
      <PingMessageInput />
    </MainScrollContainer>
  );
}

export default Ping;
