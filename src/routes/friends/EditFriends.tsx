import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertDialog from '@components/_common/alert-dialog/AlertDialog';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { UpdatedFriendItemWrapper } from '@components/friends/updated-friend-item/UpdatedFriendItem.styled';
import SubHeader from '@components/sub-header/SubHeader';
import UserRelatedAlert, { Alert } from '@components/user-page/UserRelatedAlert';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { addFriendToFavorite, deleteFavorite, hideFriend, unHideFriend } from '@utils/apis/friends';
import { breakFriend } from '@utils/apis/user';
import updateFriendsList from '@utils/updateFriendsList';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';

function EditFriends() {
  const [t] = useTranslation('translation');

  const { isLoadingMoreAllFriends, allFriends, setAllFriends, fetchAllFriends, targetRef } =
    useInfiniteFetchFriends({ filterHidden: false });

  useAsyncEffect(fetchAllFriends);

  const [showTemporalErrorAlert, setShowTemporalErrorAlert] = useState(false);
  const handleOnCloseTemporalErrorAlert = () => setShowTemporalErrorAlert(false);

  const handleToggleFavorite = (userId: number, is_favorite: boolean) => async () => {
    try {
      if (is_favorite) {
        updateFriendsList({ userId, type: 'is_favorite', value: false, setAllFriends });
        await deleteFavorite(userId);
        return;
      }
      updateFriendsList({ userId, type: 'is_favorite', value: true, setAllFriends });
      await addFriendToFavorite(userId);
    } catch {
      setShowTemporalErrorAlert(true);
    }
  };

  const handleToggleHide = (userId: number, is_hidden: boolean) => async () => {
    try {
      if (is_hidden) {
        updateFriendsList({ userId, type: 'is_hidden', value: false, setAllFriends });
        await unHideFriend(userId);
        return;
      }
      updateFriendsList({ userId, type: 'is_hidden', value: true, setAllFriends });
      await hideFriend(userId);
    } catch {
      setShowTemporalErrorAlert(true);
    }
  };

  const [showBreakFriendsAlert, setShowBreakFriendsAlert] = useState<Alert>();
  const handleClickDelete = (userId: number) => () => {
    setShowBreakFriendsAlert({
      onClickConfirm: async () => {
        try {
          handleOnCloseBreakFriendsAlert();
          updateFriendsList({ userId, type: 'break_friends', setAllFriends });
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
    <>
      <SubHeader title={t('friends.edit_friends.title')} />
      <Layout.FlexCol
        w="100%"
        h="100vh"
        justifyContent="flex-start"
        bgColor="WHITE"
        pv={12}
        mb={BOTTOM_TABBAR_HEIGHT + 10}
      >
        {allFriends.state === 'loading' && <Loader />}
        {allFriends.state === 'hasValue' && (
          <>
            {allFriends.data?.results?.map(
              ({ id, username, profile_image, is_hidden, is_favorite }) => (
                <UpdatedFriendItemWrapper key={username}>
                  <Layout.FlexRow gap={8}>
                    {is_hidden ? (
                      <Icon
                        name="star_outline"
                        size={20}
                        padding={12}
                        color="MEDIUM_GRAY"
                        disabled
                      />
                    ) : (
                      <Icon
                        name={is_favorite ? 'star' : 'star_outline'}
                        size={20}
                        padding={12}
                        color="NO_STATUS_CHIP"
                        onClick={handleToggleFavorite(id, is_favorite)}
                      />
                    )}
                    <Layout.FlexRow gap={8} alignItems="center">
                      <ProfileImage imageUrl={profile_image} username={username} size={44} />
                      <Typo type="title-small">{username}</Typo>
                    </Layout.FlexRow>
                  </Layout.FlexRow>
                  <Layout.FlexRow>
                    <Icon
                      name={is_hidden ? 'hide_true' : 'hide_false'}
                      size={44}
                      onClick={handleToggleHide(id, is_hidden)}
                    />
                    <Icon name="close" size={16} padding={14} onClick={handleClickDelete(id)} />
                  </Layout.FlexRow>
                </UpdatedFriendItemWrapper>
              ),
            )}
            {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
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
          {t('sign_up.temporary_error')}
        </AlertDialog>
      )}
    </>
  );
}

export default EditFriends;
