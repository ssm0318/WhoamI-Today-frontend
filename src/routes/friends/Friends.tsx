import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Collapse from '@components/_common/\bcollapse/Collapse';
import { Divider } from '@components/_common/divider/Divider.styled';
import UpdatedProfileItem from '@components/_common/profile-image/UpdatedProfileItem';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { StyledFriendListWrapper } from '@components/friends/friend-list/FriendProfile.styled';
import UpdatedFriendItem from '@components/friends/updated-friend-item/UpdatedFriendItem';
import Icon from '@components/header/icon/Icon';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UpdatedProfile } from '@models/api/friends';
import { getAllFriends, getFavoriteFriends, getUpdatedProfiles } from '@utils/apis/friends';
import { FlexCol, LayoutBase } from 'src/design-system/layouts';

function Friends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const [updatedProfiles, setUpdatedProfiles] = useState<FetchState<UpdatedProfile[]>>({
    state: 'loading',
  });
  const [allFriends, setAllFriends] = useState<FetchState<UpdatedProfile[]>>({ state: 'loading' });
  const [favoriteFriends, setFavoriteFriends] = useState<FetchState<UpdatedProfile[]>>({
    state: 'loading',
  });

  const fetchAllTypeFriends = async () => {
    getUpdatedProfiles().then((results) => {
      setUpdatedProfiles({ state: 'hasValue', data: results });
    });
    getAllFriends().then((results) => {
      setAllFriends({ state: 'hasValue', data: results });
    });
    getFavoriteFriends().then((results) => {
      setFavoriteFriends({ state: 'hasValue', data: results });
    });
  };

  useAsyncEffect(fetchAllTypeFriends, []);

  const navigate = useNavigate();
  const handleClickEditFriends = () => {
    navigate('edit');
  };

  const updateFavoriteCallback = () => {
    getFavoriteFriends().then((results) => {
      setFavoriteFriends({ state: 'hasValue', data: results });
    });
  };

  return (
    <SwipeLayoutList>
      <Layout.FlexRow w="100%" p={4} justifyContent="flex-end">
        <Button.Tertiary
          status="normal"
          text={t('edit_friends')}
          onClick={handleClickEditFriends}
          icon={<SvgIcon name="edit_filled" size={16} />}
          iconPosition="left"
          fontType="body-medium"
        />
      </Layout.FlexRow>
      {/* Updated Profiles */}
      {updatedProfiles.state === 'hasValue' && !!updatedProfiles.data.length && (
        <Collapse
          title={t('updated_profiles')}
          collapsedItem={
            <StyledFriendListWrapper>
              {updatedProfiles.data.map((user) => (
                <UpdatedProfileItem key={user.id} {...user} />
              ))}
            </StyledFriendListWrapper>
          }
        />
      )}
      {/* Favorites */}
      {favoriteFriends.state === 'hasValue' && (
        <>
          <Divider width={1} />
          <Collapse
            title={t('favorites')}
            collapsedItem={
              <LayoutBase w="100%">
                {favoriteFriends.data.length ? (
                  favoriteFriends.data.map((user) => (
                    <UpdatedFriendItem
                      key={user.id}
                      {...user}
                      new_chat={23}
                      updateFavoriteCallback={updateFavoriteCallback}
                      hideFriendCallback={fetchAllTypeFriends}
                    />
                  ))
                ) : (
                  <FlexCol alignItems="center" ph={75} gap={8}>
                    <Typo type="label-medium" color="DARK_GRAY">
                      {t('add_favorite')}
                    </Typo>
                    <Icon name="add_default" />
                  </FlexCol>
                )}
              </LayoutBase>
            }
          />
        </>
      )}
      <Divider width={1} marginLeading={9} />
      {/* TODO: Friend Request */}
      {/* All Friends */}
      {allFriends.state === 'hasValue' && !!allFriends.data.length && (
        <Collapse
          title={t('all_friends')}
          collapsedItem={
            <LayoutBase w="100%">
              {allFriends.data.map((user) => (
                <UpdatedFriendItem
                  key={user.id}
                  {...user}
                  new_chat={23}
                  updateFavoriteCallback={updateFavoriteCallback}
                  hideFriendCallback={fetchAllTypeFriends}
                />
              ))}
            </LayoutBase>
          }
        />
      )}
    </SwipeLayoutList>
  );
}

export default Friends;
