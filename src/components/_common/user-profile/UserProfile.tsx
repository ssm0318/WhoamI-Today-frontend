import { Layout, SvgIcon } from '@design-system';

interface UserProfileProps {
  imageUrl: string | null;
  size?: number;
}

function UserProfile({ imageUrl, size = 36 }: UserProfileProps) {
  return imageUrl ? (
    <Layout.LayoutBase w={size} h={size} rounded={size / 2}>
      <img src={imageUrl} width={size} height={size} alt="user-profile" />
    </Layout.LayoutBase>
  ) : (
    <SvgIcon name="my_profile" size={size} />
  );
}
export default UserProfile;
