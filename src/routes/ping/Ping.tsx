import { isSameDay } from 'date-fns';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PingMessage, PostPingMessageRes, RefinedPingMessage } from '@models/ping';
import { getPings } from '@utils/apis/ping';
import { MainScrollContainer } from '../Root';

function Ping() {
  const { username } = useParams();
  const { user } = useContext(UserPageContext);

  const userId = useMemo(() => {
    if (user.state !== 'hasValue' || !user.data) return;
    return user.data.id;
  }, [user.data, user.state]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();

  const [pings, setPings] = useState<PingMessage[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [oldestUnreadPingId, setOldestUnreadPingId] = useState<number | undefined>();

  const initFetchPingsAndScrollToUnreadMsg = useCallback(
    async (_userId: number, autoScroll = true) => {
      // 첫 페이지 로드
      const { oldest_unread_page: oldestUnreadPage, next, results } = await getPings(_userId);
      if (!results) {
        setNextUrl(next);
        setPings([]);
        return;
      }

      let lastNextUrl = next;
      // 첫 페이지 로드 후 oldestUnreadPage까지 데이터 로드
      const fetchPingsRecursively = async (
        page: string | null,
        accPings: PingMessage[],
      ): Promise<PingMessage[]> => {
        const pageNum = page ? page.split('page=')[1] : null;
        if (!pageNum || !oldestUnreadPage || Number(pageNum) > oldestUnreadPage) return accPings;

        const { next: _next, results: _results } = await getPings(_userId, page);
        lastNextUrl = _next;
        if (!_results) return accPings;

        return fetchPingsRecursively(_next, [...[..._results].reverse(), ...accPings]);
      };

      const initPings = [...results].reverse();
      const p = await fetchPingsRecursively(next, initPings);
      setPings(p);
      setNextUrl(lastNextUrl);

      if (!autoScroll) return;

      const oldestUnreadPing = p.find((ping) => !ping.is_read);
      setOldestUnreadPingId(oldestUnreadPing?.id);
    },
    [],
  );

  useEffect(() => {
    if (!userId) return;
    initFetchPingsAndScrollToUnreadMsg(userId);
  }, [initFetchPingsAndScrollToUnreadMsg, userId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = oldestUnreadPingId ? document.getElementById(`ping_${oldestUnreadPingId}`) : null;
    if (el) {
      el.scrollIntoView({ block: 'center' });
      setPrevScrollHeight(scrollRef.current.scrollTop); // 가장 오래된 안읽은 메시지로 스크롤 이동
    } else {
      setPrevScrollHeight(scrollRef.current?.clientHeight); // 맨 아래로 스크롤 이동
    }
  }, [oldestUnreadPingId]);

  const refinedPings = useMemo((): RefinedPingMessage[] => {
    return pings.reduce<RefinedPingMessage[]>((acc, curr) => {
      const last = acc[acc.length - 1];

      // 메시지를 작성한 날짜 별로 구분할 수 있는 정보 추가
      if (!last || !isSameDay(new Date(last.created_at), new Date(curr.created_at))) {
        acc.push({ ...curr, show_date: true });
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }, [pings]);

  useEffect(() => {
    console.debug('refinedPings', refinedPings);
  }, [refinedPings]);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl && userId) {
      setPrevScrollHeight(scrollRef.current?.scrollHeight); // infinite 스크롤시에 스크롤 위치 유지
      const { next, results } = await getPings(userId, nextUrl);
      setNextUrl(next);
      if (!results) return;
      setPings((prev) => [...[...results].reverse(), ...prev]);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  });

  useEffect(() => {
    if (!scrollRef.current) return;
    if (prevScrollHeight) {
      // 저장된 이전 위치를 기준으로 스크롤 위치 유지
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pings]);

  const handleClickRefresh = () => {
    if (!userId) return;

    // FIXME: 현재 페이지네이션 정보를 유지한채로 안읽은 메시지가 있는 페이지까지 로드하도록 수정 해보자
    initFetchPingsAndScrollToUnreadMsg(userId, false);
    setUnreadCount(0);
  };

  const insertPing = (newPing: PostPingMessageRes) => {
    const { unread_count, ...rest } = newPing;
    setPrevScrollHeight(scrollRef.current?.clientHeight); // 새 메시지 추가시 맨 아래로 스크롤 이동
    setPings((prev) => [...prev, rest]);
    setUnreadCount(unread_count);
  };

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      {/** title */}
      <SubHeader
        title={username}
        RightComponent={
          <Layout.FlexRow w="100%" style={{ position: 'relative' }}>
            <Icon name="refresh" size={36} onClick={handleClickRefresh} />
            {unreadCount > 0 && (
              <Layout.Absolute bgColor="WARNING" rounded={12} t={4} r={13} ph={3} tl={['100%', 0]}>
                <Typo type="label-small" color="WHITE">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Typo>
              </Layout.Absolute>
            )}
          </Layout.FlexRow>
        }
      />
      {/** ping list */}
      {refinedPings.length > 0 && (
        <Layout.FlexCol w="100%" gap={15} p={10} mb={PING_MESSAGE_INPUT_HEIGHT}>
          <div ref={targetRef} />
          {isLoading && <Loader />}
          {refinedPings.map((message) => {
            return <PingMessageItem key={message.id} message={message} />;
          })}
        </Layout.FlexCol>
      )}
      {/** ping input */}
      <PingMessageInput insertPing={insertPing} />
    </MainScrollContainer>
  );
}

export default Ping;
