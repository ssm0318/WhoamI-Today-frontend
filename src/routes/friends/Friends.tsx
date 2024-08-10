import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Collapse from '@components/_common/\bcollapse/Collapse';
import { Divider } from '@components/_common/divider/Divider.styled';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import FavoriteFriendItem from '@components/friends/favorite-friend-item/FavoriteFriendItem';
import UpdatedFriendItem from '@components/friends/updated-friend-item/UpdatedFriendItem';
import { StyledUpdatedFriendItem } from '@components/friends/updated-friend-item/UpdatedFriendItem.styled';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UpdatedProfile } from '@models/api/friends';
import { getFavoriteFriends } from '@utils/apis/friends';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';

function Friends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const {
    isLoadingMoreAllFriends,
    allFriends,
    fetchAllFriends,
    replaceFriendOnUpdateFavorite,
    targetRef,
  } = useInfiniteFetchFriends({ filterHidden: true });
  const [favoriteFriends, setFavoriteFriends] = useState<FetchState<UpdatedProfile[]>>({
    state: 'loading',
  });

  const fetchAllTypeFriends = async () => {
    fetchAllFriends();
    getFavoriteFriends()
      .then((results) => {
        setFavoriteFriends({ state: 'hasValue', data: results });
      })
      .catch(() => setFavoriteFriends({ state: 'hasError' }));
  };

  const navigate = useNavigate();
  const handleClickEditFriends = () => {
    navigate('edit');
  };

  const updateFavoriteCallback = (friendProfile: UpdatedProfile) => () => {
    getFavoriteFriends().then((results) => {
      setFavoriteFriends({ state: 'hasValue', data: results });

      const updatedTargetProfile = results.find((profile) => profile.id === friendProfile.id);
      replaceFriendOnUpdateFavorite(updatedTargetProfile, friendProfile);
    });
  };

  useAsyncEffect(async () => {
    fetchAllTypeFriends();
  }, []);

  const handleRefresh = async () => {
    await fetchAllTypeFriends();
  };

  const handleClickExploreFriends = () => navigate('/friends/explore');

  if (allFriends.state === 'loading' || favoriteFriends.state === 'loading') return <Loader />;

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Layout.FlexCol w="100%">
        {/* Favorites */}
        {favoriteFriends.state === 'hasValue' && (
          <Collapse
            title={`${t('favorites')} (${favoriteFriends.data.length})`}
            collapsedItem={
              <Layout.FlexRow
                w="100%"
                gap={10}
                pv={12}
                ph={8}
                style={{ flexWrap: 'wrap', rowGap: '20px' }}
                justifyContent="space-evenly"
              >
                {favoriteFriends.data.length ? (
                  favoriteFriends.data.map((user) => (
                    <FavoriteFriendItem key={user.id} user={user} />
                  ))
                ) : (
                  <Layout.FlexCol alignItems="center" ph={75} gap={8}>
                    <Typo type="label-medium" color="DARK_GRAY">
                      {t('add_favorite')}
                    </Typo>
                    <Icon name="add_default" onClick={handleClickEditFriends} />
                  </Layout.FlexCol>
                )}
              </Layout.FlexRow>
            }
          />
        )}
        {/* Friend Requests */}
        <Divider width={1} marginLeading={9} />
        {/* All Friends */}
        {allFriends.state === 'hasValue' && (
          <SwipeLayoutList>
            <Layout.FlexCol w="100%">
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
                {allFriends.data.results?.length ? (
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
                    {allFriends.data.results.map((user) => (
                      <UpdatedFriendItem
                        key={user.id}
                        user={user}
                        updateFavoriteCallback={updateFavoriteCallback(user)}
                        fetchAllTypeFriends={fetchAllTypeFriends}
                      />
                    ))}
                    <div ref={targetRef} />
                    {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
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
        )}
      </Layout.FlexCol>
    </PullToRefresh>
  );
}

export default Friends;
