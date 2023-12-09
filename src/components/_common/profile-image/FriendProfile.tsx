import {
  StyledFriendProfile,
  StyledFriendProfileImage,
} from '@components/friends/friend-list/FriendProfile.styled';
import { Typo } from '@design-system';

interface FriendProfileProps {
  imageUrl?: string | null;
  username: string;
}

function FriendProfile({ imageUrl, username }: FriendProfileProps) {
  return (
    <StyledFriendProfile>
      <StyledFriendProfileImage imageUrl={imageUrl} />
      <Typo type="label-small">{username}</Typo>
    </StyledFriendProfile>
  );
}
export default FriendProfile;
