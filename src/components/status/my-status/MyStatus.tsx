import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import StatusChip from '../status-chip/StatusChip';

// TODO(Gina): 실제 데이터로 바꾸기
function MyStatus() {
  const myProfile = useBoundStore((state) => state.myProfile);
  if (!myProfile) return null;
  const { username, profile_image } = myProfile;

  return (
    <Layout.FlexRow gap={8}>
      <ProfileImage imageUrl={profile_image} username={username} size={80} />
      <Layout.FlexCol gap={8}>
        <StatusChip availability="AVAILABLE" />
        <Font.Body type="14_regular" numberOfLines={2}>
          I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.
        </Font.Body>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default MyStatus;
