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
    const isBlob = src.startsWith('blob:');

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    if (!isBlob) {
      video.crossOrigin = 'anonymous';
    }

    video.style.position = 'fixed';
    video.style.left = '-9999px';
    video.style.top = '0';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';

    document.body.appendChild(video);
    video.src = src;

    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      try {
        video.pause();
      } catch {
        // ignore
      }
      video.removeAttribute('src');
      try {
        video.load();
      } catch {
        // ignore
      }
      if (video.parentNode) video.parentNode.removeChild(video);
      if (timeoutId) clearTimeout(timeoutId);
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

    const seekToFirstFrame = () => {
      try {
        const target = Math.min(0.1, (video.duration || 1) / 2);
        if (video.currentTime === target) {
          capture();
        } else {
          video.currentTime = target;
        }
      } catch {
        capture();
      }
    };

    const tryFrameCallback = () => {
      const rvfc = (
        video as unknown as {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;
      if (typeof rvfc === 'function') {
        rvfc.call(video, () => capture());
        return true;
      }
      return false;
    };

    video.addEventListener('loadedmetadata', () => {
      if (!tryFrameCallback()) {
        seekToFirstFrame();
      }
      // muted autoplay nudges WKWebView to actually decode a frame
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            try {
              video.pause();
            } catch {
              // ignore
            }
            if (!settled) capture();
          })
          .catch(() => {
            // autoplay blocked — capture path will still run via seeked/rvfc
          });
      }
    });
    video.addEventListener('seeked', capture);
    video.addEventListener('error', () => finish(null));

    timeoutId = setTimeout(() => finish(null), 5000);
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
  const [extractionDone, setExtractionDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setThumbnail(null);
    setExtractionDone(false);
    extractFirstFrame(src).then((url) => {
      if (cancelled) return;
      setThumbnail(url);
      setExtractionDone(true);
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
        <S.Placeholder $size={size} $borderRadius={borderRadius}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v1.69l3.55-2.13A1 1 0 0 1 21 6.92v10.16a1 1 0 0 1-1.45.86L16 15.81v1.69a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 17.5v-11Z" />
          </svg>
        </S.Placeholder>
      )}
      {showPlayOverlay && extractionDone && thumbnail && (
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
