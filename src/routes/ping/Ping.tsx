import { isSameDay } from 'date-fns';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { PingMessage, RefinedPingMessage } from '@models/ping';
import { MainScrollContainer } from '../Root';

function Ping() {
  const { username } = useParams();
  const { user } = useContext(UserPageContext);

  const userId = useMemo(() => {
    if (user.state !== 'hasValue' || !user.data) return;
    return user.data.id;
  }, [user.data, user.state]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initScrollRef = useRef(false);
  const prevScrollHeightRef = useRef<number>();

  const beforeInfiniteLoad = () => {
    if (!scrollRef.current) return;
    console.log('set prev scroll height', scrollRef.current.scrollHeight);
    prevScrollHeightRef.current = scrollRef.current.scrollHeight;
  };

  const {
    targetRef,
    data: pings,
    isLoading,
    isLoadingMore,
    mutate: refetchPings,
  } = useSWRInfiniteScroll<PingMessage>({
    key: userId ? `/ping/user/${userId}/` : '',
    beforeInfiniteLoad,
  });

  const handleClickRefresh = () => {
    refetchPings();
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
  }, [pings]);

  useEffect(() => {
    console.log('pings', pings);
  }, [pings]);

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
  }, [pings]);

  useEffect(() => {
    console.log('refinedPings', refinedPings);
  }, [refinedPings]);

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
            <div ref={targetRef} />
            {isLoadingMore && <Loader />}
            {refinedPings.map((message) => {
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
