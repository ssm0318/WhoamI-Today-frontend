import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import MissionGroupItem from '@components/note/mission-group-item/MissionGroupItem';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { useViewAs, useViewAsUser } from '@components/view-as/PreviewModeContext';
import { Layout } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { AllPostFeedItem, POST_TYPE } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { readUserAllNotes, readUserAllResponses } from '@utils/apis/user';
import { userListApiPrefixForViewer } from '@utils/apis/userApiPrefix';
import { withViewAs } from '@utils/apis/withViewAs';

type AllPostSectionProps = {
  /** username이 있으면 username에 대한 posts를, 없으면 내 posts를 보여줍니다. */
  username?: string;
};

function AllPostSection({ username }: AllPostSectionProps) {
  const [t] = useTranslation('translation');
  const { user } = useContext(UserPageContext);
  const { featureFlags, myProfile } = useBoundStore(UserSelector);
  const areFriends = user?.data?.are_friends === true;
  const isMyPage = !username;
  const viewAs = useViewAs();
  const viewAsUser = useViewAsUser();

  const {
    targetRef,
    data: posts,
    isLoading: isPostsLoading,
    isLoadingMore: isPostsLoadingMore,
    mutate: refetchPosts,
  } = useSWRInfiniteScroll<AllPostFeedItem>({
    key: withViewAs(
      `${userListApiPrefixForViewer(
        featureFlags?.postsVerQ,
        myProfile?.current_ver,
      )}user/${encodeURIComponent(username || 'me')}/all-posts/`,
      {
        viewAs,
        viewAsUser,
      },
    ),
  });

  const { noteId, responseId } = useParams();

  // 노트/답변 상세 페이지에서의 변경사항 업데이트
  useEffect(() => {
    if (noteId || responseId) return;
    refetchPosts();

    if (username && user?.state === 'hasValue') {
      readUserAllNotes(username);
      readUserAllResponses(username);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, responseId, username, user?.state]);

  const renderPostItem = useCallback(
    (item: AllPostFeedItem) => {
      if (item.type === POST_TYPE.NOTE) {
        return (
          <NoteItem
            key={`note-${item.id}`}
            note={item}
            isMyPage={isMyPage}
            refresh={refetchPosts}
          />
        );
      }
      if (item.type === POST_TYPE.MISSION_GROUP) {
        return (
          <MissionGroupItem
            key={`mission-group-${item.mission_id ?? item.mission_prompt}`}
            group={item}
            refresh={refetchPosts}
          />
        );
      }
      return (
        <ResponseItem
          key={`response-${item.id}`}
          response={item}
          isMyPage={isMyPage}
          displayType="FEED"
          refresh={refetchPosts}
        />
      );
    },
    [isMyPage, refetchPosts],
  );

  return (
    <Layout.FlexCol w="100%" pr={12}>
      <Layout.FlexCol gap={8} mt={10} w="100%" h="100%">
        {isPostsLoading ? (
          <NoteLoader />
        ) : posts?.[0] && posts[0].count > 0 ? (
          <>
            {posts.map(({ results }) => results?.map((post) => renderPostItem(post)))}
            <div ref={targetRef} />
            {isPostsLoadingMore && (
              <Layout.FlexRow w="100%" h={40}>
                <Loader />
              </Layout.FlexRow>
            )}
          </>
        ) : (
          <Layout.FlexRow alignItems="center" w="100%" h="100%">
            <NoContents
              text={
                isMyPage || areFriends ? t('no_contents.notes') : t('no_contents.notes_not_friend')
              }
              pv={20}
            />
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default AllPostSection;
