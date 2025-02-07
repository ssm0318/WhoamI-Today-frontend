import { isSameDay } from 'date-fns';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
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

  const [pings, setPings] = useState<PingMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const initFetchPingsAndScrollToUnreadMsg = useCallback(
    async (_userId: number, autoScroll = true) => {
      // 첫 페이지 로드
      const { oldest_unread_page: oldestUnreadPage, next, results } = await getPings(_userId);
      if (!results) return;

      console.log({ oldestUnreadPage });

      // 첫 페이지 로드 후 UnreadPage까지 데이터 로드..!
      const fetchPingsRecursively = async (
        page: string | null,
        accPings: PingMessage[],
      ): Promise<PingMessage[]> => {
        const pageNum = page ? page.split('page=')[1] : null;

        console.log({ page, accPings });
        if (!pageNum || !oldestUnreadPage || Number(pageNum) > oldestUnreadPage) return accPings;

        const { next: _next, results: _results } = await getPings(_userId, page);
        if (!_results) return accPings;

        console.log('fetch!!!', { _next, _results });
        return fetchPingsRecursively(_next, [...[..._results].reverse(), ...accPings]);
      };

      const initPings = [...results].reverse();
      const p = await fetchPingsRecursively(next, initPings);
      console.log(p);
      setPings(p);

      // 가장 오래된 안읽은 메시지로 스크롤 이동
      if (!autoScroll) return;
      const oldestUnreadPing = p.find((ping) => !ping.is_read);
      console.log('oldestUnreadPing', oldestUnreadPing);
      if (!oldestUnreadPing) return;

      const el = document.getElementById(`ping_${oldestUnreadPing.id}`);
      console.log('el', el);
      if (el) {
        el.scrollIntoView({ block: 'center' });
      } else {
        scrollToBottom();
      }
    },
    [],
  );

  useEffect(() => {
    console.log('userId', userId);
    if (!userId) return;

    initFetchPingsAndScrollToUnreadMsg(userId);
  }, [initFetchPingsAndScrollToUnreadMsg, userId]);

  const handleClickRefresh = () => {
    if (!userId) return;
    initFetchPingsAndScrollToUnreadMsg(userId, false);
    setUnreadCount(0);
  };

  const refinedPings = useMemo((): RefinedPingMessage[] => {
    return pings.reduce<RefinedPingMessage[]>((acc, curr) => {
      const last = acc[acc.length - 1];

      if (!last || !isSameDay(new Date(last.created_at), new Date(curr.created_at))) {
        acc.push({ ...curr, show_date: true });
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }, [pings]);

  const insertPing = (newPing: PostPingMessageRes) => {
    const { unread_count, ...rest } = newPing;
    setPings((prev) => [...prev, rest]);
    setUnreadCount(unread_count);
  };

  useEffect(() => {
    console.log('refinedPings', refinedPings);
  }, [refinedPings]);

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      {/** title */}
      <SubHeader
        title={username}
        RightComponent={
          <Layout.FlexRow>
            <Icon name="refresh" size={36} onClick={handleClickRefresh} />
            <Typo type="label-medium">{unreadCount}</Typo>
          </Layout.FlexRow>
        }
      />
      {/** TODO: infinite scroll */}
      {/* <div ref={targetRef} /> */}
      {/** ping list */}
      {
        // isLoading ? (
        //   <Loader />
        // ) : (
        refinedPings.length > 0 && (
          <Layout.FlexCol w="100%" gap={15} p={10} mb={PING_MESSAGE_INPUT_HEIGHT}>
            {/* {isLoading && <Loader />} */}
            {refinedPings.map((message) => {
              return <PingMessageItem key={message.id} message={message} />;
            })}
          </Layout.FlexCol>
        )
        // )
      }
      {/** ping input */}
      <PingMessageInput insertPing={insertPing} scrollToBottom={scrollToBottom} />
    </MainScrollContainer>
  );
}

export default Ping;
