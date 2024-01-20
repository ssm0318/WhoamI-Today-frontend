import { useNavigate } from 'react-router-dom';
import { UpdatedDot } from '@common-components/updated-dot/UpdatedDot.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import Icon from '@components/header/icon/Icon';
import { Layout, Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import { addFriendToFavorite, deleteFavorite, hideFriend } from '@utils/apis/friends';
import { UpdatedChatNumber } from '../friend-list/FriendProfile.styled';
import { StyledUpdatedItemWrapper, UpdatedFriendItemWrapper } from './UpdatedFriendItem.styled';

interface UpdatedFriendItemProps extends UpdatedProfile {
  new_chat: number;
  updateFavoriteCallback?: () => void;
  hideFriendCallback: () => void;
}

function UpdatedFriendItem({
  id,
  profile_image,
  username,
  is_favorite,
  updateFavoriteCallback,
  current_user_read,
  hideFriendCallback,
  new_chat,
}: UpdatedFriendItemProps) {
  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleDeleteFavorite = () => {
    deleteFavorite(id).then(() => {
      updateFavoriteCallback?.();
    });
  };

  const handleAddFavorite = () => {
    addFriendToFavorite(id).then(() => {
      updateFavoriteCallback?.();
    });
  };

  const handleHide = () => {
    hideFriend(id).then(() => {
      hideFriendCallback?.();
    });
  };

  return (
    <SwipeLayout
      itemWidth={74}
      rightContent={[
        <StyledSwipeButton key="hide" backgroundColor="DARK_GRAY" onClick={handleHide}>
          <Typo type="body-medium" color="WHITE" textAlign="center">
            Hide
          </Typo>
        </StyledSwipeButton>,
        <StyledSwipeButton key="unfriend" backgroundColor="ERROR">
          <Typo type="body-medium" color="WHITE" textAlign="center">
            Unfriend
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
                <Icon name="star_outline" size={28} color="WHITE" />
              </StyledSwipeButton>,
            ]
      }
    >
      <UpdatedFriendItemWrapper>
        <Layout.FlexRow alignItems="center" gap={8}>
          <ProfileImage imageUrl={profile_image} username={username} size={44} />
          <Typo type="label-large">{username}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow alignItems="center" gap={24} pr={8}>
          <StyledUpdatedItemWrapper>
            {!current_user_read && <UpdatedDot top={-6} left={-7} />}
            <Icon name="friend_updates_profile" size={28} onClick={handleClickProfile} />
          </StyledUpdatedItemWrapper>
          <StyledUpdatedItemWrapper>
            <Icon name="friend_updates_chat" size={28} />
            {new_chat && (
              <UpdatedChatNumber type="label-small" color="PRIMARY">
                {new_chat}
              </UpdatedChatNumber>
            )}
          </StyledUpdatedItemWrapper>
        </Layout.FlexRow>
      </UpdatedFriendItemWrapper>
    </SwipeLayout>
  );
}

export default UpdatedFriendItem;
