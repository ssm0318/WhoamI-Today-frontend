import { useNavigate } from 'react-router-dom';
import { UpdatedDot } from '@common-components/updated-dot/UpdatedDot.styled';
import { UpdatedProfileWrapper } from '@components/friends/friend-list/FriendProfile.styled';
import { Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import ProfileImage from './ProfileImage';

function UpdatedProfileItem({ profile_image, username }: UpdatedProfile) {
  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  return (
    <UpdatedProfileWrapper onClick={handleClickProfile}>
      <UpdatedDot top={0} left={8} />
      <ProfileImage imageUrl={profile_image} username={username} size={44} />

      <Typo type="label-small">{username}</Typo>
    </UpdatedProfileWrapper>
  );
}
export default UpdatedProfileItem;
