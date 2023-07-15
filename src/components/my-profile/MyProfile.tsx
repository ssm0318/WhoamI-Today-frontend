import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function MyProfile() {
  const myProfile = useBoundStore((state) => state.myProfile);

  if (!myProfile) return null;

  const { username, profile_image } = myProfile;
  return (
    <Layout.FlexRow alignItems="center" h={36}>
      <ProfileImage imageUrl={profile_image} username={username} size={36} />
      <Layout.FlexRow alignItems="center" pl={8}>
        <Font.Body type="18_regular" color="GRAY_4">
          {username}
        </Font.Body>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default MyProfile;
