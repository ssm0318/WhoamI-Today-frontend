import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertDialog from '@components/_common/alert-dialog/AlertDialog';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubHeader from '@components/sub-header/SubHeader';
import UserRelatedAlert, { Alert } from '@components/user-page/UserRelatedAlert';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useFetchFavoriteFriends } from '@hooks/useFetchFavoriteFriends';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { UpdatedProfile } from '@models/api/friends';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { addFriendToFavorite, deleteFavorite, hideFriend, unHideFriend } from '@utils/apis/friends';
import { breakFriend } from '@utils/apis/user';
import { StyledFriendItemWrapper } from 'src/routes/friends/EditFriends.styled';
import { MainScrollContainer } from 'src/routes/Root';

function EditFriends() {
  const [t] = useTranslation('translation');
  const { featureFlags } = useBoundStore(UserSelector);

  const { isLoadingMoreAllFriends, allFriends, isAllFriendsLoading, targetRef, updateFriendList } =
    useInfiniteFetchFriends();
  const { updateFavoriteFriendList } = useFetchFavoriteFriends();

  const [showTemporalErrorAlert, setShowTemporalErrorAlert] = useState(false);
  const handleOnCloseTemporalErrorAlert = () => setShowTemporalErrorAlert(false);

  const handleToggleFavorite = (item: UpdatedProfile, is_favorite: boolean) => async () => {
    const { id: userId } = item;
    try {
      if (is_favorite) {
        updateFriendList({ item, type: 'is_favorite', value: false });
        updateFavoriteFriendList({ item, type: 'is_favorite', value: false });
        await deleteFavorite(userId);
      } else {
        updateFriendList({ item, type: 'is_favorite', value: true });
        updateFavoriteFriendList({ item, type: 'is_favorite', value: true });
        await addFriendToFavorite(userId);
      }
    } catch {
      setShowTemporalErrorAlert(true);
    }
  };

  const handleToggleHide = (item: UpdatedProfile, is_hidden: boolean) => async () => {
    const { id: userId } = item;
    try {
      if (is_hidden) {
        updateFriendList({ item, type: 'is_hidden', value: false });
        updateFavoriteFriendList({ item, type: 'is_hidden', value: false });
        await unHideFriend(userId);
        return;
      }
      updateFriendList({ item, type: 'is_hidden', value: true });
      updateFavoriteFriendList({ item, type: 'is_hidden', value: true });
      await hideFriend(userId);
    } catch {
      setShowTemporalErrorAlert(true);
    }
  };

  const [showBreakFriendsAlert, setShowBreakFriendsAlert] = useState<Alert>();
  const handleClickDelete = (item: UpdatedProfile) => () => {
    const { id: userId } = item;
    setShowBreakFriendsAlert({
      onClickConfirm: async () => {
        try {
          handleOnCloseBreakFriendsAlert();
          updateFriendList({ item, type: 'break_friends' });
          await breakFriend(userId);
        } catch {
          setShowTemporalErrorAlert(true);
        }
      },
      confirmMsg: t('user_page.are_you_sure_you_want_to_delete_this_friend'),
    });
  };
  const handleOnCloseBreakFriendsAlert = () => setShowBreakFriendsAlert(undefined);

  return (
    <MainScrollContainer>
      <SubHeader title={t('friends.edit_friends.title')} />
      <Layout.FlexCol
        w="100%"
        justifyContent="flex-start"
        bgColor="WHITE"
        pv={12}
        mb={BOTTOM_TABBAR_HEIGHT + 10}
      >
        {isAllFriendsLoading && <Loader />}
        {allFriends && (
          <>
            {allFriends.map(({ results }) =>
              results?.map((friend) => {
                const { username, profile_image, is_hidden, is_favorite } = friend;
                return (
                  <StyledFriendItemWrapper key={username}>
                    <Layout.FlexRow gap={8}>
                      {featureFlags?.friendList &&
                        (is_hidden ? (
                          <Icon
                            name="friend_unpinned"
                            size={20}
                            padding={12}
                            color="MEDIUM_GRAY"
                            disabled
                          />
                        ) : (
                          <Icon
                            name={is_favorite ? 'friend_pinned' : 'friend_unpinned'}
                            size={20}
                            padding={12}
                            onClick={handleToggleFavorite(friend, is_favorite)}
                          />
                        ))}
                      <Layout.FlexRow gap={8} alignItems="center">
                        <ProfileImage imageUrl={profile_image} username={username} size={44} />
                        <Typo ellipsis={{ enabled: true, maxWidth: 150 }} type="title-small">
                          {username}
                        </Typo>
                      </Layout.FlexRow>
                    </Layout.FlexRow>
                    <Layout.FlexRow>
                      <Icon
                        name={is_hidden ? 'hide_true' : 'hide_false'}
                        size={44}
                        onClick={handleToggleHide(friend, is_hidden)}
                      />
                      <Icon
                        name="close"
                        size={16}
                        padding={14}
                        onClick={handleClickDelete(friend)}
                      />
                    </Layout.FlexRow>
                  </StyledFriendItemWrapper>
                );
              }),
            )}
            {isLoadingMoreAllFriends && <Loader />}
            <div ref={targetRef} />
          </>
        )}
      </Layout.FlexCol>
      {showBreakFriendsAlert && (
        <UserRelatedAlert
          visible={!!showBreakFriendsAlert}
          close={handleOnCloseBreakFriendsAlert}
          {...showBreakFriendsAlert}
        />
      )}
      {showTemporalErrorAlert && (
        <AlertDialog
          visible={showTemporalErrorAlert}
          onClickDimmed={handleOnCloseTemporalErrorAlert}
        >
          {t('error.temporary_error')}
        </AlertDialog>
      )}
    </MainScrollContainer>
  );
}

export default EditFriends;
