import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import UpdatedFriendItemDefault from '@components/friends/updated-friend-item/UpdatedFriendItemDefault';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { MainScrollContainer } from 'src/routes/Root';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function DefaultMyFriendsList() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const { targetRef, allFriends, isAllFriendsLoading, isLoadingMoreAllFriends, refetchAllFriends } =
    useInfiniteFetchFriends();

  const navigate = useNavigate();

  const handleRefresh = async () => {
    await refetchAllFriends();
  };

  const { scrollRef } = useRestoreScrollPosition('friendsDetail');

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          <SubHeader title={t('list_friends.my_title')} />
          {/* All Friends */}
          <Layout.FlexCol w="100%">
            <Layout.FlexCol w="100%" pv={8} gap={4}>
              {isAllFriendsLoading ? (
                <AllFriendListLoader />
              ) : allFriends?.[0] && allFriends[0].count > 0 ? (
                <>
                  {/* 친구 목록 */}
                  {allFriends.map(({ results }) =>
                    results?.map((user) => {
                      if (user.is_hidden) return null;
                      return (
                        <UpdatedFriendItemDefault key={`friends_${user.id}`} isMyPage user={user} />
                      );
                    }),
                  )}
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

export default DefaultMyFriendsList;
