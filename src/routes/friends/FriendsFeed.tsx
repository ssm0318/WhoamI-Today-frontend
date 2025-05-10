import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Note, POST_TYPE, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';

function FriendsFeed() {
  const [t] = useTranslation('translation');

  const { scrollRef } = useRestoreScrollPosition('friendsFeed');

  const { fetchCheckIn } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    fetchCheckIn: state.fetchCheckIn,
  }));

  const {
    targetRef,
    data: feedItems,
    isLoading,
    isLoadingMore: isFeedItemsLoadingMore,
    mutate: refetchFeed,
  } = useSWRInfiniteScroll<Note | Response>({
    key: `/user/feed/full`,
  });

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchFeed(), fetchCheckIn(), getMe()]);
  }, [refetchFeed, fetchCheckIn]);

  const renderFeedItem = useCallback(
    (item: Note | Response) => {
      if (item.type === POST_TYPE.NOTE) {
        return <NoteItem key={item.id} note={item} isMyPage={false} refresh={refetchFeed} />;
      }
      return (
        <ResponseItem
          key={item.id}
          response={item}
          displayType="FEED"
          isMyPage={false}
          refresh={refetchFeed}
        />
      );
    },
    [refetchFeed],
  );

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          {isLoading ? (
            <NoteLoader />
          ) : feedItems?.[0] && feedItems[0].count > 0 ? (
            <>
              {feedItems.map(({ results }) => results?.map((item) => renderFeedItem(item)))}
              <div ref={targetRef} />
              {isFeedItemsLoadingMore && (
                <Layout.FlexRow w="100%" h={40}>
                  <Loader />
                </Layout.FlexRow>
              )}
            </>
          ) : (
            <Layout.FlexRow alignItems="center" w="100%" h="100%">
              <NoContents title={t('no_contents.notes')} />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendsFeed;
