import { MouseEvent } from 'react';
import { Layout, SvgIcon } from '@design-system';
import { NonShrinkWrapper } from './ProfileImage.styled';

interface ProfileImageProps {
  imageUrl?: string | null;
  size?: number;
  username?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

function ProfileImage({ imageUrl, username, className, size = 36, onClick }: ProfileImageProps) {
  return (
    <NonShrinkWrapper onClick={onClick}>
      <Layout.LayoutBase w={size} h={size} rounded={size / 2} className={className}>
        {imageUrl ? (
          <img src={imageUrl} width={size} height={size} alt={`${username ?? 'user'}-profile`} />
        ) : (
          <SvgIcon name="default_profile" size={size} />
        )}
      </Layout.LayoutBase>
    </NonShrinkWrapper>
  );
}

export default ProfileImage;
