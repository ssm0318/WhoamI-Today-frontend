import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { CheckCircle, Font, Layout } from '@design-system';
import { User } from '@models/user';

interface FriendStyleProps {
  profileSize?: number;
  fontType?: Font.BodyType;
}

export function Friend({
  profile_image,
  username,
  profileSize = 20,
  fontType = '14_regular',
}: Pick<User, 'profile_image' | 'username'> & FriendStyleProps) {
  return (
    <Layout.FlexRow alignItems="center">
      <ProfileImage imageUrl={profile_image} username={username} size={profileSize} />
      <Font.Body type={fontType} ml={16}>
        {username}
      </Font.Body>
    </Layout.FlexRow>
  );
}

interface SelectableUserItemProps {
  user: User;
  checked: boolean;
  handleToggleFriend: (user: User) => void;
}

function SelectableUserItem({
  user,
  checked,
  handleToggleFriend,
  profileSize,
  fontType,
}: SelectableUserItemProps & FriendStyleProps) {
  const { profile_image, username } = user;
  return (
    <>
      <Friend
        profile_image={profile_image}
        username={username}
        profileSize={profileSize}
        fontType={fontType}
      />
      <CheckCircle
        name={username}
        checked={!!checked}
        onChange={() => handleToggleFriend(user)}
        hideLabel
      />
    </>
  );
}

export default SelectableUserItem;
