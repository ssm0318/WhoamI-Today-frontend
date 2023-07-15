import { Layout, SvgIcon } from '@design-system';

interface ProfileImageProps {
  imageUrl: string | null;
  size?: number;
  username?: string;
  className?: string;
}

function ProfileImage({ imageUrl, username, className, size = 36 }: ProfileImageProps) {
  return imageUrl ? (
    <Layout.LayoutBase w={size} h={size} rounded={size / 2} className={className}>
      <img src={imageUrl} width={size} height={size} alt={`${username ?? 'user'}-profile`} />
    </Layout.LayoutBase>
  ) : (
    <SvgIcon name="my_profile" size={size} className={className} />
  );
}
export default ProfileImage;
