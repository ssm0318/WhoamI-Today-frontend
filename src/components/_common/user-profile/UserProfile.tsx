import { Layout, SvgIcon } from '@design-system';

interface UserProfileProps {
  imageUrl: string | null;
  size?: number;
  username?: string;
  className?: string;
}

function UserProfile({ imageUrl, username, className, size = 36 }: UserProfileProps) {
  return imageUrl ? (
    <Layout.LayoutBase w={size} h={size} rounded={size / 2} className={className}>
      <img src={imageUrl} width={size} height={size} alt={`${username ?? 'user'}-profile`} />
    </Layout.LayoutBase>
  ) : (
    <SvgIcon name="my_profile" size={size} className={className} />
  );
}
export default UserProfile;
