import { useContext, useEffect, useMemo, useRef } from 'react';
import Loader from '@components/_common/loader/Loader';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { PingMessage } from '@models/ping';
import { getPings } from '@utils/apis/ping';
import { MainScrollContainer } from '../Root';

function Ping() {
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

  useEffect(() => {
    if (!userId) return;
    console.log('get pings', userId);
    getPings(userId);
  }, [userId]);

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

  const sortedPings = useMemo(() => {
    if (!pings) return;
    return [...pings].reverse().map((ping) => {
      if (!ping.results) return ping;
      return { ...ping, results: [...ping.results].reverse() };
    });
  }, [pings]);

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
            <div ref={targetRef} />
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
