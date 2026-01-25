import { Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '@components/_common/divider/Divider';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PingRoom } from '@models/ping';
import { useBoundStore } from '@stores/useBoundStore';
import { getPingRooms } from '@utils/apis/ping';
import { PingRoomItem } from './PingRoomItem';

function PingList() {
  const [t] = useTranslation('translation', { keyPrefix: 'ping' });
  const myProfile = useBoundStore((state) => state.myProfile);

  const [rooms, setRooms] = useState<PingRoom[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPingRooms = useCallback(async (next?: string | null) => {
    try {
      const { results = [], next: _next } = await getPingRooms(next);
      setRooms((prev) => {
        const list = next ? [...prev, ...(results ?? [])] : results ?? [];
        return list;
      });
      setNextUrl(_next);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useAsyncEffect(async () => {
    await fetchPingRooms();
  }, [fetchPingRooms]);

  const infiniteCallback = useCallback(async () => {
    if (nextUrl) {
      await fetchPingRooms(nextUrl);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPingRooms, nextUrl]);
  const { isLoading, targetRef, setIsLoading } =
    useInfiniteScroll<HTMLDivElement>(infiniteCallback);

  const currentUserId = myProfile?.id ?? 1;

  return (
    <MainContainer>
      <SubHeader title={t('list_title')} LeftComponent={<Layout.LayoutBase w={36} h={36} />} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} ph={DEFAULT_MARGIN} pb={14} gap={0}>
        {loading && rooms.length < 1 && (
          <Layout.FlexRow w="100%" h={40} justifyContent="center">
            <Loader />
          </Layout.FlexRow>
        )}
        {!loading && (
          <>
            {rooms.map((room, i) => (
              <Fragment key={room.id}>
                {i > 0 && <Divider width={1} />}
                <PingRoomItem room={room} currentUserId={currentUserId} />
              </Fragment>
            ))}
            <div ref={targetRef} />
            {isLoading && (
              <Layout.FlexRow w="100%" h={40}>
                <Loader />
              </Layout.FlexRow>
            )}
            {!isLoading && rooms.length < 1 && <NoContents text={t('no_rooms')} mv={10} />}
          </>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default PingList;
