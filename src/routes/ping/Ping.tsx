import { isSameDay } from 'date-fns';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { PingMessage, RefinedPingMessage } from '@models/ping';
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
  const [unreadPage, setUnreadPage] = useState<number | undefined>();
  const [nextPage, setNextPage] = useState<string | undefined | null>();

  useEffect(() => {
    if (!userId) return;

    // 첫 페이지 로드
    getPings(userId).then(({ oldest_unread_page: oldestUnreadPage, next, results }) => {
      if (!results) return;
      setPings([...results].reverse());
      setUnreadPage(oldestUnreadPage);
      setNextPage(next);
    });
  }, [userId]);

  // 첫 페이지 로드 후 UnreadPage까지 데이터 로드..!
  useEffect(() => {
    if (!unreadPage || !userId) return;

    const requestPage = nextPage ? nextPage.split('page=')[1] : null;

    if (!requestPage) return;

    if (Number(requestPage) > unreadPage) return;

    console.log('requestPage', { requestPage, unreadPage });

    getPings(userId, nextPage).then(({ results, next }) => {
      if (!results) return;
      setPings((prev) => [...[...results].reverse(), ...prev]);
      setNextPage(next);
    });
  }, [nextPage, unreadPage, userId]);

  // 가장 오래된 안읽은 메시지로 스크롤 이동
  useEffect(() => {
    console.log('pings', pings);

    const oldestUnreadPing = pings.find((ping) => !ping.is_read);

    console.log('oldestUnreadPing', oldestUnreadPing);

    // TODO: 안읽은 메시지가 없는 케이스 -> 맨 아래로 스크롤 이동
    if (!oldestUnreadPing) return;

    const el = document.getElementById(`ping_${oldestUnreadPing.id}`);

    console.log('el', el);

    el?.scrollIntoView({ block: 'center' });
  }, [pings]);

  const handleClickRefresh = () => {
    // TODO: refetch
    // refetchPings();
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

  const insertPing = (newPing: PingMessage) => {
    setPings((prev) => [...prev, newPing]);
  };

  useEffect(() => {
    console.log('refinedPings', refinedPings);
  }, [refinedPings]);

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      {/** title */}
      <SubHeader
        title={username}
        RightComponent={<Icon name="refresh" size={36} onClick={handleClickRefresh} />}
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
      <PingMessageInput insertPing={insertPing} />
    </MainScrollContainer>
  );
}

export default Ping;
