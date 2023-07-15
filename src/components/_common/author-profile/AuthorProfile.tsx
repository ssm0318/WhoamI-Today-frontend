import { Font, Layout } from '@design-system';
import { AdminAuthor } from '@models/post';
import { User } from '@models/user';
import { BodyType } from 'src/design-system/Font/Font.types';
import UserProfile from '../user-profile/UserProfile';
import { getAuthorProfileInfo } from './AuthorProfile.helper';

interface AuthorProfileProps {
  authorDetail: User | AdminAuthor;
  usernameFont?: BodyType;
  profileImgSize?: number;
}

function AuthorProfile({
  authorDetail,
  profileImgSize,
  usernameFont = '14_semibold',
}: AuthorProfileProps) {
  const { username, imageUrl } = getAuthorProfileInfo(authorDetail);
  return (
    <Layout.FlexRow alignItems="center" gap={5}>
      <UserProfile imageUrl={imageUrl} username={username} size={profileImgSize} />
      <Font.Body type={usernameFont}>{username}</Font.Body>
    </Layout.FlexRow>
  );
}

export default AuthorProfile;
