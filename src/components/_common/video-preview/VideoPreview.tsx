import { ReactNode } from 'react';
import * as S from './VideoPreview.styled';

interface VideoPreviewProps {
  src: string;
  size?: number;
  borderRadius?: number;
  showPlayOverlay?: boolean;
  children?: ReactNode;
}

function VideoPreview({
  src,
  size = 50,
  borderRadius = 8,
  showPlayOverlay = true,
  children,
}: VideoPreviewProps) {
  return (
    <S.Wrapper>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <S.Video
        src={src}
        $size={size}
        $borderRadius={borderRadius}
        playsInline
        muted
        preload="metadata"
        {...{ 'webkit-playsinline': 'true' }}
      />
      {showPlayOverlay && (
        <S.PlayOverlay>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <polygon points="8,5 19,12 8,19" />
          </svg>
        </S.PlayOverlay>
      )}
      {children}
    </S.Wrapper>
  );
}

export default VideoPreview;
