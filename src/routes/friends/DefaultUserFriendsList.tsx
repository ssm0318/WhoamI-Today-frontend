import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import UpdatedFriendItemDefault from '@components/friends/updated-friend-item/UpdatedFriendItemDefault';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import useInfiniteFetchUserFriends from '@hooks/useInfiniteFetchUserFriends';
import { MainScrollContainer } from 'src/routes/Root';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function DefaultUserFriendsList() {
  const { username } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const {
    targetRef,
    allFriends,
    isAllFriendsLoading,
    isLoadingMoreAllFriends,
    refetchAllFriends: userRefetchAllFriends,
  } = useInfiniteFetchUserFriends(username || '');

  const handleRefresh = async () => {
    await userRefetchAllFriends();
  };

  return (
    <MainScrollContainer>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          <SubHeader title={t('list_friends.friends_title', { username })} />
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
                        <UpdatedFriendItemDefault
                          key={`friends_${user.id}`}
                          isMyPage={false}
                          user={user}
                        />
                      );
                    }),
                  )}
                  <div ref={targetRef} />
                  {isLoadingMoreAllFriends && <AllFriendItemLoader />}
                </>
              ) : (
                <Layout.FlexCol alignItems="center" ph={75} gap={8} w="100%">
                  <Typo type="label-medium" color="DARK_GRAY">
                    {t('list_friends.no_friends')}
                  </Typo>
                </Layout.FlexCol>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default DefaultUserFriendsList;
