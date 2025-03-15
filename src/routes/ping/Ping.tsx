import { isSameDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PingMessage, PostPingMessageRes, RefinedPingMessage } from '@models/ping';
import { getPings } from '@utils/apis/ping';
import { MainScrollContainer } from '../Root';
import { PingsListLoader } from './PingsLoader';

function Ping() {
  const { userId } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'ping' });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | undefined>();

  const [pings, setPings] = useState<PingMessage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [oldestUnreadPingId, setOldestUnreadPingId] = useState<number | undefined>();
  const [firstLoad, setFirstLoad] = useState(true);

  const initFetchPingsAndScrollToUnreadMsg = useCallback(
    async (_userId: number, autoScroll = true) => {
      // 첫 페이지 로드
      const {
        oldest_unread_page: oldestUnreadPage,
        next,
        results,
        username: _username,
      } = await getPings(_userId);
      setUsername(_username ?? '');

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
      setFirstLoad(false);

      if (!autoScroll) return;

      const oldestUnreadPing = p.find((ping) => !ping.is_read);
      setOldestUnreadPingId(oldestUnreadPing?.id);
    },
    [],
  );

  useEffect(() => {
    if (!userId) return;
    initFetchPingsAndScrollToUnreadMsg(Number(userId));
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

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl && userId) {
      setPrevScrollHeight(scrollRef.current?.scrollHeight); // infinite 스크롤시에 스크롤 위치 유지
      const { next, results } = await getPings(Number(userId), nextUrl);
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

  const handleClickRefresh = async () => {
    if (!userId) return;

    // FIXME: 현재 페이지네이션 정보를 유지한채로 안읽은 메시지가 있는 페이지까지 로드하도록 수정 해보자
    setUnreadCount(0);
    await initFetchPingsAndScrollToUnreadMsg(Number(userId), false);
  };

  const insertPing = async (newPing: PostPingMessageRes) => {
    const { unread_count, ...rest } = newPing;
    setPrevScrollHeight(scrollRef.current?.clientHeight); // 새 메시지 추가시 맨 아래로 스크롤 이동
    setPings((prev) => [...prev, rest]);
    setUnreadCount(unread_count);

    await handleClickRefresh();
    setPrevScrollHeight(scrollRef.current?.clientHeight); // 새로운 메시지가 있는 경우에 스크롤을 다시 맨 아래로 이동
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
      {firstLoad && (
        <Layout.FlexCol w="100%" alignItems="center" mt={30}>
          <PingsListLoader />
        </Layout.FlexCol>
      )}
      {/** ping list */}
      {!firstLoad && refinedPings.length > 0 && (
        <Layout.FlexCol w="100%" gap={15} p={10} mb={PING_MESSAGE_INPUT_HEIGHT}>
          <div ref={targetRef} />
          {isLoading && <Loader />}
          {refinedPings.map((message) => {
            return <PingMessageItem key={message.id} message={message} />;
          })}
        </Layout.FlexCol>
      )}
      {!firstLoad && refinedPings.length === 0 && (
        <Layout.FlexCol w="100%" h="100%" alignItems="center" mt={50}>
          <Typo type="body-medium" color="MEDIUM_GRAY">
            {t('no_pings')}
          </Typo>
        </Layout.FlexCol>
      )}
      {/** ping input */}
      <PingMessageInput insertPing={insertPing} userId={Number(userId)} />
    </MainScrollContainer>
  );
}

export default Ping;
