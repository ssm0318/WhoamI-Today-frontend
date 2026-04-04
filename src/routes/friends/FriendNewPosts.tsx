import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { MainScrollContainer } from '../Root';

interface NewPostItem {
  id: number;
  type: 'Note' | 'Response';
  body: any;
}

function FriendNewPosts() {
  const { userId } = useParams<{ userId: string }>();

  const {
    targetRef,
    data: postsData,
    isLoadingMore,
    isLoading,
    mutate,
  } = useSWRInfiniteScroll<NewPostItem>({
    key: `/user/${userId || '0'}/new-posts/`,
  });

  useEffect(() => {
    // Posts are marked as read by the API when fetched
  }, [userId]);

  const handleRefresh = async () => {
    await mutate();
  };

  return (
    <MainScrollContainer>
      <SubHeader title="New Posts" />
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" gap={16} ph={16} pv={12}>
          {isLoading ? (
            <>
              <NoteLoader />
              <NoteLoader />
            </>
          ) : postsData && postsData.some((page) => (page.results?.length ?? 0) > 0) ? (
            <>
              {postsData.map((page) =>
                page.results?.map((item) => {
                  if (item.type === 'Note') {
                    return (
                      <NoteItem key={`note-${item.body.id}`} note={item.body} isMyPage={false} />
                    );
                  }
                  if (item.type === 'Response') {
                    return (
                      <ResponseItem
                        key={`response-${item.body.id}`}
                        response={item.body}
                        displayType="FEED"
                      />
                    );
                  }
                  return null;
                }),
              )}
              <div ref={targetRef} />
              {isLoadingMore && <NoteLoader />}
            </>
          ) : (
            <Layout.FlexCol w="100%" alignItems="center" pv={40}>
              <Typo type="body-medium" color="MEDIUM_GRAY" textAlign="center">
                No new posts
              </Typo>
            </Layout.FlexCol>
          )}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendNewPosts;
