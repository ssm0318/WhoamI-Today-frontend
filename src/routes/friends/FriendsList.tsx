import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { POST_TYPE, PostVisibility } from '@models/post';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function FriendsList() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const { targetRef, allFriends, isAllFriendsLoading, isLoadingMoreAllFriends, refetchAllFriends } =
    useInfiniteFetchFriends();

  const navigate = useNavigate();

  const handleRefresh = async () => {
    await Promise.all([refetchAllFriends(), getMe()]);
  };

  const { scrollRef } = useRestoreScrollPosition('friendsPage');

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20}>
          {/* All Friends */}
          <Layout.FlexCol w="100%">
            <Layout.FlexCol w="100%" pv={8}>
              {isAllFriendsLoading ? (
                <AllFriendListLoader />
              ) : allFriends?.[0] && allFriends[0].count > 0 ? (
                <>
                  {/* 친구 목록 */}
                  <Layout.FlexCol w="100%" gap={12}>
                    {allFriends.map(({ results }) =>
                      results?.map((user) => {
                        if (user.is_hidden) return null;
                        return (
                          <FriendItemWithUpdates
                            user={user}
                            // TODO: 더미 데이터 교체
                            recentPost={{
                              content: 'test',
                              id: 1,
                              created_at: '2021-01-01',
                              updated_at: '2021-01-01',
                              author: 'test',
                              author_detail: user,
                              like_count: 0,
                              current_user_like_id: null,
                              current_user_reaction_id_list: [],
                              type: POST_TYPE.NOTE,
                              images: [],
                              comment_count: 0,
                              like_user_sample: [],
                              like_reaction_user_sample: [],
                              comments: [],
                              current_user_read: false,
                              is_edited: false,
                              visibility: PostVisibility.FRIENDS,
                            }}
                            moreRentPosts
                          />
                        );
                      }),
                    )}
                  </Layout.FlexCol>
                  <div ref={targetRef} />
                  {isLoadingMoreAllFriends && <AllFriendItemLoader />}
                </>
              ) : (
                <Layout.FlexCol alignItems="center" ph={75} gap={8} w="100%">
                  <Typo type="label-medium" color="DARK_GRAY">
                    {t('no_friends')}
                  </Typo>
                  <Icon
                    name="add_user"
                    background="LIGHT_GRAY"
                    onClick={() => navigate('/friends/explore')}
                  />
                </Layout.FlexCol>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendsList;
