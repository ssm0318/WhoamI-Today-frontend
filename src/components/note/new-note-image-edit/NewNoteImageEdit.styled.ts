import styled from 'styled-components';
import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

export const StyledNoteImageEditContainer = styled(Layout.FixedFullScreen)`
  z-index: 9999;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledNewNoteImageWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${TOP_NAVIGATION_HEIGHT + 16}px 16px 8px 16px;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 0;

  .ReactCrop {
    max-height: 100%;
    max-width: 100%;
  }
`;

export const StyledNewNoteImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: calc(100vh - ${TOP_NAVIGATION_HEIGHT + 120}px);
  object-fit: contain;
`;

export const AspectRatioBar = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.DARK};
  flex-shrink: 0;
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
