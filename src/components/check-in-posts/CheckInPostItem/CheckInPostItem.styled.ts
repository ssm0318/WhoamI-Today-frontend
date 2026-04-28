import styled from 'styled-components';
import { Colors } from '@design-system';

export const PostImage = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 12px;
  background-color: ${Colors.LIGHT};
`;

export const PinBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${Colors.PRIMARY};
`;

export const VideoThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  max-height: 200px;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
`;

export const VideoThumbnailImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
  background-color: ${Colors.LIGHT};
`;

export const PlayOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${Colors.LIGHT};
  border-radius: 12px;
`;
