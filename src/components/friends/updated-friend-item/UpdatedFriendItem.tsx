import { UpdatedDot } from '@common-components/updated-dot/UpdatedDot.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
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
  );
}

export default UpdatedFriendItem;
