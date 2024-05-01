import { Font, Layout } from '@design-system';
import { User } from '@models/user';
import ProfileImage from '../profile-image/ProfileImage';

interface AuthorProfileProps {
  authorDetail: User;
  usernameFont?: Font.BodyType;
  profileImgSize?: number;
}

function AuthorProfile({
  authorDetail,
  profileImgSize,
  usernameFont = '14_semibold',
}: AuthorProfileProps) {
  const { username, profile_image } = authorDetail;
  return (
    <Layout.FlexRow alignItems="center" gap={5}>
      <ProfileImage imageUrl={profile_image} username={username} size={profileImgSize} />
      <Font.Body pre type={usernameFont}>
        {username}
      </Font.Body>
    </Layout.FlexRow>
  );
}

export default AuthorProfile;
