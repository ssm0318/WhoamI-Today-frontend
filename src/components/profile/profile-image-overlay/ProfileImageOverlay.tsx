import { MouseEvent } from 'react';
import { TOP_NAVIGATION_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout, SvgIcon } from '@design-system';
import { MainWrapper } from '@styles/wrappers';

interface ProfileImageOverlayProps {
  imageUrl?: string | null;
  username?: string;
  onClose: () => void;
}

function ProfileImageOverlay({ imageUrl, username, onClose }: ProfileImageOverlayProps) {
  const handleCloseClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleOverlayClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <MainWrapper
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: Z_INDEX.PROFILE_IMAGE_OVERLAY,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleOverlayClick}
    >
      {/* Close Button (X) */}
      <Layout.Absolute
        t={TOP_NAVIGATION_HEIGHT + 16}
        r={16}
        style={{
          cursor: 'pointer',
          zIndex: Z_INDEX.PROFILE_IMAGE_OVERLAY + 1,
        }}
        onClick={handleCloseClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Space') {
            onClose();
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
            onClose();
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
    </MainWrapper>
  );
}

export default ProfileImageOverlay;
