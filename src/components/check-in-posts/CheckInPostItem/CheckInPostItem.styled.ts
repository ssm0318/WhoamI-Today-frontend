import styled from 'styled-components';
import { Colors } from '@design-system';

export const PostImage = styled.img`
  max-width: 100%;
  object-fit: contain;
  border-radius: 12px;
  background-color: ${Colors.LIGHT};
`;

export const PostImageButton = styled.button`
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
`;

export const ImagePreviewBackdrop = styled.button`
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  transform: translateX(-50%);
`;

export const ImagePreview = styled.img`
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
`;
