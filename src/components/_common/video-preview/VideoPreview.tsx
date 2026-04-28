import { ReactNode, useEffect, useState } from 'react';
import * as S from './VideoPreview.styled';

interface VideoPreviewProps {
  src: string;
  size?: number;
  borderRadius?: number;
  showPlayOverlay?: boolean;
  children?: ReactNode;
}

function extractFirstFrame(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.setAttribute('webkit-playsinline', 'true');

    let settled = false;
    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
    };
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };

    const capture = () => {
      try {
        const width = video.videoWidth;
        const height = video.videoHeight;
        if (!width || !height) {
          finish(null);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          finish(null);
          return;
        }
        ctx.drawImage(video, 0, 0, width, height);
        finish(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        finish(null);
      }
    };

    video.addEventListener('loadeddata', () => {
      if (video.readyState >= 2) {
        try {
          video.currentTime = Math.min(0.1, (video.duration || 1) / 2);
        } catch {
          capture();
        }
      }
    });
    video.addEventListener('seeked', capture);
    video.addEventListener('error', () => finish(null));

    setTimeout(() => finish(null), 5000);
  });
}

function VideoPreview({
  src,
  size = 50,
  borderRadius = 8,
  showPlayOverlay = true,
  children,
}: VideoPreviewProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setThumbnail(null);
    extractFirstFrame(src).then((url) => {
      if (!cancelled) setThumbnail(url);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <S.Wrapper>
      {thumbnail ? (
        <S.Thumbnail src={thumbnail} alt="" $size={size} $borderRadius={borderRadius} />
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <S.Video
          src={src}
          $size={size}
          $borderRadius={borderRadius}
          playsInline
          muted
          preload="metadata"
          {...{ 'webkit-playsinline': 'true' }}
        />
      )}
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
