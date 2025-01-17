import { isSameDay } from 'date-fns';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { PingMessage, RefinedPingMessage } from '@models/ping';
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
        emoji: '😊',
        is_read: true,
        created_at: '2024-03-02T18:41:09.769419+09:00',
      },
      {
        id: 2,
        sender: { id: 1, username: 'cherry', url: '' },
        content: 'test test test',
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
        emoji: '😊',
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
  const { username } = useParams();
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

  const refinedPings = useMemo((): RefinedPingMessage[] => {
    if (!pings?.[0] || pings[0].count < 1) return [];

    const flattenAndSortedPings: PingMessage[] = [...pings].reverse().flatMap((ping) => {
      if (!ping.results) return [];
      return [...ping.results].reverse();
    });

    return flattenAndSortedPings.reduce<RefinedPingMessage[]>((acc, curr) => {
      const last = acc[acc.length - 1];

      if (!last || !isSameDay(new Date(last.created_at), new Date(curr.created_at))) {
        acc.push({ ...curr, show_date: true });
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }, []);

  useEffect(() => {
    console.log('refinedPings', refinedPings);
  }, [refinedPings]);

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
        title={username}
        RightComponent={<Icon name="refresh" size={36} onClick={handleClickRefresh} />}
      />
      {/** ping list */}
      {isLoading ? (
        <Loader />
      ) : (
        refinedPings.length > 0 && (
          <Layout.FlexCol w="100%" gap={15} p={10} mb={PING_MESSAGE_INPUT_HEIGHT}>
            {/* <div ref={targetRef} /> */}
            {isLoadingMore && <Loader />}
            {refinedPings.map((message) => {
              // 날짜가 다르면, 날짜 구분선 추가
              return <PingMessageItem key={message.id} message={message} />;
            })}
          </Layout.FlexCol>
        )
      )}
      {/** ping input */}
      <PingMessageInput />
    </MainScrollContainer>
  );
}

export default Ping;
