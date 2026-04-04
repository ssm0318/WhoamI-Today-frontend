import styled from 'styled-components';
import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

const HEADER_HEIGHT = TOP_NAVIGATION_HEIGHT; // 44px
const ASPECT_BAR_HEIGHT = 50;
const PADDING = 16;

export const StyledNoteImageEditContainer = styled(Layout.FixedFullScreen)`
  z-index: 9999;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledNewNoteImageWrapper = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  bottom: ${ASPECT_BAR_HEIGHT}px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDING}px;
  box-sizing: border-box;
  overflow: hidden;

  /* ReactCrop sizes itself from the image. We must set max-height on
     ReactCrop so it inherits down to child-wrapper and then to img
     via the library's own "max-height: inherit" rules. */
  .ReactCrop {
    max-height: calc(100vh - ${HEADER_HEIGHT + ASPECT_BAR_HEIGHT + PADDING * 2}px) !important;
  }
`;

export const StyledNewNoteImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: calc(100vh - ${HEADER_HEIGHT + ASPECT_BAR_HEIGHT + PADDING * 2}px);
  object-fit: contain;
`;

export const AspectRatioBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${ASPECT_BAR_HEIGHT}px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.DARK};
  box-sizing: border-box;
`;

export const AspectButton = styled.button<{ $isSelected: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? '#8700FF' : '#555')};
  background-color: ${({ $isSelected }) => ($isSelected ? '#8700FF' : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? '#FFF' : '#AAA')};
  font-size: 12px;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;
