import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AlertDialog from '@components/_common/alert-dialog/AlertDialog';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import UserRelatedAlert, { Alert } from '@components/user-page/UserRelatedAlert';
import { Layout, SvgIcon, Typo } from '@design-system';
import { UpdateFriendListParams } from '@hooks/useInfiniteFetchFriends';
import { Connection, UpdatedProfile } from '@models/api/friends';
import { addFriendToFavorite, deleteFavorite, hideFriend } from '@utils/apis/friends';
import { breakFriend } from '@utils/apis/user';
import { StyledProfileArea, StyledUpdatedFriendItem } from './UpdatedFriendItem.styled';

interface Props {
  user: UpdatedProfile;
  updateFriendList: (params: UpdateFriendListParams) => void;
  updateFavoriteFriendList: () => void;
}

function UpdatedFriendItem({ user, updateFriendList, updateFavoriteFriendList }: Props) {
  const {
    id,
    profile_image,
    username,
    is_favorite,
    current_user_read,
    unread_ping_count,
    track_id,
    description,
    connection_status,
  } = user;

  const [t] = useTranslation('translation', { keyPrefix: 'friend' });

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleDeleteFavorite = () => {
    deleteFavorite(id).then(() => {
      updateFavoriteFriendList();
      updateFriendList({ type: 'is_favorite', item: user, value: false });
    });
  };

  const handleAddFavorite = () => {
    addFriendToFavorite(id).then(() => {
      updateFavoriteFriendList();
      updateFriendList({ type: 'is_favorite', item: user, value: true });
    });
  };

  const handleHide = () => {
    hideFriend(id).then(() => {
      updateFavoriteFriendList();
      updateFriendList({ type: 'is_hidden', item: user, value: true });
    });
  };

  const [showBreakFriendsAlert, setShowBreakFriendsAlert] = useState<Alert>();
  const [showTemporalErrorAlert, setShowTemporalErrorAlert] = useState(false);

  const handleClickBreakFriend = () => {
    setShowBreakFriendsAlert({
      onClickConfirm: async () => {
        try {
          handleOnCloseBreakFriendsAlert();
          await breakFriend(id);

          updateFavoriteFriendList();
          updateFriendList({ type: 'break_friends', item: user });
        } catch {
          setShowTemporalErrorAlert(true);
        }
      },
      confirmMsg: t('are_you_sure_you_want_to_delete_this_friend'),
    });
  };

  const handleOnCloseTemporalErrorAlert = () => setShowTemporalErrorAlert(false);

  const handleOnCloseBreakFriendsAlert = () => setShowBreakFriendsAlert(undefined);

  const handleClickPing = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/ping`);
  };

  return (
    <SwipeLayout
      itemWidth={74}
      rightContent={[
        <StyledSwipeButton key="hide" backgroundColor="DARK_GRAY" onClick={handleHide}>
          <Typo type="body-medium" color="WHITE" textAlign="center">
            {t('hide')}
          </Typo>
        </StyledSwipeButton>,
        <StyledSwipeButton key="unfriend" backgroundColor="ERROR" onClick={handleClickBreakFriend}>
          <Typo type="body-medium" color="WHITE" textAlign="center">
            {t('unfriend')}
          </Typo>
        </StyledSwipeButton>,
      ]}
      leftContent={
        is_favorite
          ? [
              <StyledSwipeButton
                key="favorite"
                backgroundColor="DARK_GRAY"
                onClick={handleDeleteFavorite}
              >
                <Icon name="star" size={28} />
              </StyledSwipeButton>,
            ]
          : [
              <StyledSwipeButton
                key="favorite"
                backgroundColor="DARK_GRAY"
                onClick={handleAddFavorite}
              >
                <SvgIcon name="star_outline" size={28} color="WHITE" />
              </StyledSwipeButton>,
            ]
      }
    >
      <Layout.FlexRow w="100%" ph={16} gap={16}>
        <StyledUpdatedFriendItem
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          onClick={handleClickProfile}
        >
          <StyledProfileArea>
            <Layout.FlexRow alignItems="center" gap={7}>
              <ProfileImage
                imageUrl={profile_image}
                username={username}
                size={44}
                updated={!current_user_read}
              />
              <Layout.FlexCol>
                <Layout.FlexRow gap={4} alignItems="center">
                  <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 100 }}>
                    {username}
                  </Typo>
                  <Layout.FlexRow
                    bgColor="SECONDARY"
                    rounded={4}
                    gap={5}
                    ph={4}
                    pv={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typo type="label-small" color="BLACK">
                      {connection_status === Connection.FRIEND ? t('friend') : t('close_friend')}
                    </Typo>
                  </Layout.FlexRow>
                </Layout.FlexRow>
                {description && (
                  <Typo type="label-medium" color="MEDIUM_GRAY" numberOfLines={1}>
                    {description}
                  </Typo>
                )}
              </Layout.FlexCol>
            </Layout.FlexRow>
          </StyledProfileArea>
          <Layout.FlexRow
            w="100%"
            style={{ position: 'relative' }}
            justifyContent="flex-end"
            alignItems="center"
            gap={3}
          >
            <Layout.FlexRow w="100%" ml={12}>
              {track_id && <SpotifyMusic track={track_id} sharer={user} useDetailBottomSheet />}
            </Layout.FlexRow>
            <Layout.LayoutBase pb={2}>
              <Icon name="ping_send" size={22} onClick={handleClickPing} />
            </Layout.LayoutBase>
            {unread_ping_count > 0 && (
              <Layout.Absolute
                bgColor="BLACK"
                alignItems="center"
                rounded={10}
                t={-3}
                r={9}
                ph={3}
                pv={1}
                tl={['100%', 0]}
              >
                <Typo type="label-small" color="WHITE" fontSize={7} fontWeight={700}>
                  {unread_ping_count > 99 ? '99+' : unread_ping_count}
                </Typo>
              </Layout.Absolute>
            )}
          </Layout.FlexRow>
        </StyledUpdatedFriendItem>
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
      </Layout.FlexRow>
    </SwipeLayout>
  );
}

export default UpdatedFriendItem;
