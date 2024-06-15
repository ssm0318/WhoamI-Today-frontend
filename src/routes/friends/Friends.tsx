import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Collapse from '@components/_common/\bcollapse/Collapse';
import { Divider } from '@components/_common/divider/Divider.styled';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import FavoriteFriendItem from '@components/friends/favorite-friend-item/FavoriteFriendItem';
import UpdatedFriendItem from '@components/friends/updated-friend-item/UpdatedFriendItem';
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

  useAsyncEffect(async () => {
    fetchAllTypeFriends();
  }, []);

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

  if (allFriends.state === 'loading' || favoriteFriends.state === 'loading') return <Loader />;

  return (
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
                favoriteFriends.data.map((user) => <FavoriteFriendItem key={user.id} {...user} />)
              ) : (
                <Layout.FlexCol alignItems="center" ph={75} gap={8}>
                  <Typo type="label-medium" color="DARK_GRAY">
                    {t('add_favorite')}
                  </Typo>
                  <Icon name="add_default" />
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
            <Layout.FlexCol w="100%">
              {allFriends.data.results?.length ? (
                <>
                  {allFriends.data.results.map((user) => (
                    <UpdatedFriendItem
                      key={user.id}
                      {...user}
                      updateFavoriteCallback={updateFavoriteCallback(user)}
                      new_chat={user.unread_cnt}
                      fetchAllTypeFriends={fetchAllTypeFriends}
                    />
                  ))}
                  <div ref={targetRef} />
                  {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
                </>
              ) : (
                <Layout.FlexCol alignItems="center" ph={75} gap={8}>
                  <Typo type="label-medium" color="DARK_GRAY">
                    {t('add_favorite')}
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
  );
}

export default Friends;
