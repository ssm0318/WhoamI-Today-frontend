import { UpdatedDot } from '@common-components/updated-dot/UpdatedDot.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import Icon from '@components/header/icon/Icon';
import { Layout, Typo } from '@design-system';
import { UpdatedChatNumber } from '../friend-list/FriendProfile.styled';
import { StyledUpdatedItemWrapper, UpdatedFriendItemWrapper } from './UpdatedFriendItem.styled';

interface UpdatedFriendItemProps {
  profile_image: string | null;
  username: string;
  updated?: boolean;
  new_chat: number;
}

function UpdatedFriendItem({
  profile_image,
  username,
  updated = false,
  new_chat,
}: UpdatedFriendItemProps) {
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
        <StyledSwipeButton key="unfriend" backgroundColor="DARK_GRAY">
          <Icon name="star" size={28} />
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
