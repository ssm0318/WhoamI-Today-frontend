import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import UpdatedFriendItem from '@components/friends/updated-friend-item/UpdatedFriendItem';
import { StyledUpdatedFriendItem } from '@components/friends/updated-friend-item/UpdatedFriendItem.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { useFetchFavoriteFriends } from '@hooks/useFetchFavoriteFriends';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { MainScrollContainer } from 'src/routes/Root';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function FriendsDetail() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const {
    targetRef,
    allFriends,
    isAllFriendsLoading,
    isLoadingMoreAllFriends,
    updateFriendList,
    refetchAllFriends,
  } = useInfiniteFetchFriends();

  const { refetchFavoriteFriends } = useFetchFavoriteFriends();

  const navigate = useNavigate();
  const handleClickEditFriends = () => {
    navigate('/my/friends/edit');
  };

  const handleRefresh = async () => {
    refetchFavoriteFriends();
    refetchAllFriends();
  };

  const handleClickExploreFriends = () => {
    navigate('/my/friends/explore');
  };

  const { scrollRef } = useRestoreScrollPosition('friendsDetail');

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          <SubHeader title={t('list_friends.title')} />
          {/* All Friends */}
          <SwipeLayoutList>
            <Layout.FlexCol w="100%">
              {/* Friend Requests */}
              <Layout.FlexRow
                w="100%"
                ph={16}
                pv={12}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typo type="title-medium">{t('all_friends')}</Typo>
                <Button.Tertiary
                  status="normal"
                  text={t('edit_friends.title')}
                  onClick={handleClickEditFriends}
                  icon={<SvgIcon name="edit_filled" size={16} />}
                  iconPosition="left"
                  fontType="body-medium"
                />
              </Layout.FlexRow>
              <Layout.FlexCol w="100%" pv={8} gap={4}>
                {isAllFriendsLoading ? (
                  <AllFriendListLoader />
                ) : allFriends?.[0] && allFriends[0].count > 0 ? (
                  <>
                    {/* Explore Friends */}
                    <Layout.FlexRow w="100%" ph={16} gap={16}>
                      <StyledUpdatedFriendItem
                        w="100%"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Layout.FlexRow
                          alignItems="center"
                          gap={7}
                          onClick={handleClickExploreFriends}
                        >
                          <Icon name="add_user" background="LIGHT_GRAY" size={44} />
                          <Layout.FlexCol>
                            <Layout.FlexRow gap={4} alignItems="center">
                              <Typo type="label-large">{t('explore_friends.title')}</Typo>
                            </Layout.FlexRow>
                          </Layout.FlexCol>
                        </Layout.FlexRow>
                      </StyledUpdatedFriendItem>
                    </Layout.FlexRow>
                    {/* 친구 목록 */}
                    {allFriends.map(({ results }) =>
                      results?.map((user) => {
                        if (user.is_hidden) return null;
                        return (
                          <UpdatedFriendItem
                            key={`friends_${user.id}`}
                            user={user}
                            updateFriendList={updateFriendList}
                            updateFavoriteFriendList={refetchFavoriteFriends}
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
          </SwipeLayoutList>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendsDetail;
