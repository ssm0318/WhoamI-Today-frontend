import { UpdatedDot } from '@common-components/updated-dot/UpdatedDot.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import Icon from '@components/header/icon/Icon';
import { Layout, Typo } from '@design-system';
import { User } from '@models/user';
import { addFriendToFavorite } from '@utils/apis/friends';
import { UpdatedChatNumber } from '../friend-list/FriendProfile.styled';
import { StyledUpdatedItemWrapper, UpdatedFriendItemWrapper } from './UpdatedFriendItem.styled';

interface UpdatedFriendItemProps extends User {
  updated?: boolean;
  new_chat: number;
}

function UpdatedFriendItem({
  id,
  profile_image,
  username,
  updated = false,
  new_chat,
}: UpdatedFriendItemProps) {
  const handleAddFavorite = async () => {
    await addFriendToFavorite(id);
  };

  return (
    <SwipeLayout
      itemWidth={74}
      rightContent={[
        <StyledSwipeButton key="hide" backgroundColor="DARK_GRAY">
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
      leftContent={[
        <StyledSwipeButton key="favorite" backgroundColor="DARK_GRAY" onClick={handleAddFavorite}>
          <Icon name="star_outline" size={28} color="WHITE" />
        </StyledSwipeButton>,
      ]}
    >
      <UpdatedFriendItemWrapper>
        <Layout.FlexRow alignItems="center" gap={8}>
          <ProfileImage imageUrl={profile_image} username={username} size={44} />
          <Typo type="label-large">{username}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow alignItems="center" gap={24} pr={8}>
          <StyledUpdatedItemWrapper>
            {updated && <UpdatedDot top={-6} left={-7} />}
            <Icon name="friend_updates_profile" size={28} />
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
