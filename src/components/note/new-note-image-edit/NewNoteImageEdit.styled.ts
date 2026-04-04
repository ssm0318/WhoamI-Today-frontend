import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

export const StyledNoteImageEditContainer = styled(Layout.FixedFullScreen)`
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
`;

export const StyledNewNoteImageWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${TOP_NAVIGATION_HEIGHT + 8}px 0 ${BOTTOM_TABBAR_HEIGHT}px 0;
  overflow: auto;
`;

export const StyledNewNoteImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export const AspectRatioBar = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.8);
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
