import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Note } from '@models/post';
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
    data: notes,
    isLoading,
    isLoadingMore: isNotesLoadingMore,
    mutate: refetchFeed,
  } = useSWRInfiniteScroll<Note>({
    key: `/user/feed/`,
  });

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchFeed(), fetchCheckIn(), getMe()]);
  }, [refetchFeed, fetchCheckIn]);

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          {isLoading ? (
            <NoteLoader />
          ) : notes?.[0] && notes[0].count > 0 ? (
            <>
              {notes.map(({ results }) =>
                results?.map((note) => (
                  <NoteItem key={note.id} note={note} isMyPage={false} refresh={refetchFeed} />
                )),
              )}
              <div ref={targetRef} />
              {isNotesLoadingMore && (
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
