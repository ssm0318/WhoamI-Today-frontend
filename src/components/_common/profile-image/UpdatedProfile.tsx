import { UpdatedDot } from '@common-components/updated-dot/UpdatedDot.styled';
import {
  StyledUserProfile,
  UpdatedProfileWrapper,
} from '@components/friends/friend-list/FriendProfile.styled';
import { Typo } from '@design-system';

interface UpdatedProfileProps {
  imageUrl?: string | null;
  username: string;
}

function UpdatedProfile({ imageUrl, username }: UpdatedProfileProps) {
  return (
    <UpdatedProfileWrapper>
      <UpdatedDot top={0} left={8} />
      <StyledUserProfile imageUrl={imageUrl} />
      <Typo type="label-small">{username}</Typo>
    </UpdatedProfileWrapper>
  );
}
export default UpdatedProfile;
