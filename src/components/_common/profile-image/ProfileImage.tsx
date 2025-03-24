import { MouseEvent, useState } from 'react';
import UpdatedLabel from '@components/friends/updated-label/UpdatedLabel';
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

  const handleOverlayClick = () => {
    setIsExpanded(false);
  };

  const handleCloseClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  return (
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

      {expandible && isExpanded && (
        <Layout.Absolute
          t={0}
          l={0}
          r={0}
          b={0}
          style={{
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
          onClick={handleOverlayClick}
        >
          {/* Close Button (X) */}
          <Layout.Absolute
            t={16}
            r={16}
            style={{
              cursor: 'pointer',
              zIndex: 10000,
            }}
            onClick={handleCloseClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                setIsExpanded(false);
              }
            }}
          >
            <span
              style={{
                fontSize: 32,
                color: 'white',
                lineHeight: 1,
              }}
            >
              ×
            </span>
          </Layout.Absolute>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsExpanded(false);
              }
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
                alt={`${username ?? 'user'}-profile-expanded`}
              />
            ) : (
              <SvgIcon name="default_profile" size={Math.min(window.innerWidth * 0.7, 400)} />
            )}
          </div>
        </Layout.Absolute>
      )}
    </NonShrinkWrapper>
  );
}

export default ProfileImage;
