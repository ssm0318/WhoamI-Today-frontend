import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Note, POST_TYPE, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { MainScrollContainer } from '../Root';
import { PinnedPostsHeaderWrapper } from './PinnedPosts.styled';

function PinnedPosts() {
  const [t] = useTranslation('translation', { keyPrefix: 'pinned_posts' });

  const { username } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = username === myProfile?.username;
  const navigate = useNavigate();

  const {
    targetRef,
    data: posts,
    isLoading: isPostsLoading,
    isLoadingMore: isPostsLoadingMore,
    mutate: refetchPosts,
  } = useSWRInfiniteScroll<Note | Response>({
    key: username ? `/pins/users/${encodeURIComponent(username)}/` : '/pins/me/',
  });

  // Transform nested API response structure - extract content_object and add pin info
  const transformedPosts = posts?.map((page) => {
    if (!page.results) return page;
    // Check if results have content_object field (pinned posts API structure)
    const firstItem = page.results[0];
    if (firstItem && 'content_object' in firstItem) {
      return {
        ...page,
        results: page.results.map(
          (item: Note | Response | { id: number; content_object: Note | Response }) => {
            if ('content_object' in item) {
              // Extract content_object and add pin information
              const pinId = item.id; // The pin object's id
              const contentObject = item.content_object as Note | Response;
              return {
                ...contentObject,
                is_pinned: true,
                current_user_pin_id: pinId,
              };
            }
            return item;
          },
        ),
      };
    }
    return page;
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderPostItem = useCallback(
    (item: Note | Response) => {
      if (item.type === POST_TYPE.NOTE) {
        return <NoteItem key={item.id} note={item} isMyPage={isMyPage} refresh={refetchPosts} />;
      }
      return (
        <ResponseItem
          key={item.id}
          response={item}
          isMyPage={isMyPage}
          displayType="FEED"
          refresh={refetchPosts}
        />
      );
    },
    [isMyPage, refetchPosts],
  );

  const totalCount = transformedPosts?.[0]?.count ?? posts?.[0]?.count ?? 0;

  return (
    <MainScrollContainer>
      <PinnedPostsHeaderWrapper>
        <Layout.LayoutBase w={36} h={36}>
          <button type="button" onClick={handleGoBack}>
            <SvgIcon name="arrow_left" size={36} color="BLACK" />
          </button>
        </Layout.LayoutBase>
        <Layout.FlexRow>
          <Typo type="head-line">{`${t('title')} (${totalCount})`}</Typo>
        </Layout.FlexRow>
      </PinnedPostsHeaderWrapper>
      <Layout.FlexCol w="100%" pr={12} pl={12}>
        <Layout.FlexCol gap={8} mt={10} w="100%" h="100%">
          {isPostsLoading ? (
            <NoteLoader />
          ) : (transformedPosts?.[0] || posts?.[0]) &&
            (transformedPosts?.[0]?.count || posts?.[0]?.count || 0) > 0 ? (
            <>
              {(transformedPosts || posts)?.map(({ results }) =>
                results?.map((post) => renderPostItem(post)),
              )}
              <div ref={targetRef} />
              {isPostsLoadingMore && (
                <Layout.FlexRow w="100%" h={40}>
                  <Loader />
                </Layout.FlexRow>
              )}
            </>
          ) : (
            <Layout.FlexRow alignItems="center" w="100%" h="100%">
              <NoContents text={t('no_contents')} pv={20} />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default PinnedPosts;
