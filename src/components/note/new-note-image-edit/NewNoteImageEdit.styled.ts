import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

export const StyledNoteImageEditContainer = styled(Layout.FixedFullScreen)`
  z-index: 200;
`;

export const StyledNewNoteImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${TOP_NAVIGATION_HEIGHT}px 0 ${BOTTOM_TABBAR_HEIGHT}px 0;
`;

export const StyledNewNoteImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
