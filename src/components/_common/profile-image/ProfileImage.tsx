import { MouseEvent, useState } from 'react';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
import ProfileImageOverlay from '@components/profile/profile-image-overlay/ProfileImageOverlay';
import { Layout, SvgIcon } from '@design-system';
import { NonShrinkWrapper } from './ProfileImage.styled';

interface ProfileImageProps {
  imageUrl?: string | null;
  size?: number;
  username?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  updated?: boolean;
  updatedLabelSize?: number;
  expandible?: boolean;
}

function ProfileImage({
  imageUrl,
  username,
  className,
  size = 36,
  onClick,
  updated = false,
  updatedLabelSize = 8,
  expandible = false,
}: ProfileImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageClick = (e: MouseEvent) => {
    if (expandible) {
      setIsExpanded(true);
      e.stopPropagation();
    }
    onClick?.(e);
  };

  return (
    <>
      <NonShrinkWrapper onClick={expandible ? handleImageClick : onClick}>
        {!!updated && (
          <Layout.Absolute
            t={-updatedLabelSize / 4}
            l="50%"
            style={{ transform: 'translateX(-50%)' }}
          >
            <UpdatedLabel fontSize={updatedLabelSize} />
          </Layout.Absolute>
        )}
        <Layout.LayoutBase w={size} h={size} rounded={size / 2} className={className}>
          {imageUrl ? (
            <img src={imageUrl} width={size} height={size} alt={`${username ?? 'user'}-profile`} />
          ) : (
            <SvgIcon name="default_profile" size={size} />
          )}
        </Layout.LayoutBase>
      </NonShrinkWrapper>
      {expandible && isExpanded && (
        <ProfileImageOverlay
          imageUrl={imageUrl}
          username={username}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}

export default ProfileImage;
