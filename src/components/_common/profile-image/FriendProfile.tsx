import {
  StyledFriendProfile,
  StyledFriendProfileImage,
} from '@components/friends/friend-list/FriendProfile.styled';
import { Font } from '@design-system';

interface FriendProfileProps {
  imageUrl?: string | null;
  selected?: boolean;
  username: string;
  selectFriend: () => void;
}

function FriendProfile({ imageUrl, username, selected = false, selectFriend }: FriendProfileProps) {
  return (
    <StyledFriendProfile onClick={selectFriend}>
      <StyledFriendProfileImage imageUrl={imageUrl} selected={selected} />
      <Font.Body type="12_regular">{username}</Font.Body>
    </StyledFriendProfile>
  );
}
export default FriendProfile;
