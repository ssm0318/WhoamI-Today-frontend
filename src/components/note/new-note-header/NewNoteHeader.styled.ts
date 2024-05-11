import styled from 'styled-components';
import {
  DEFAULT_MARGIN,
  MAX_WINDOW_WIDTH,
  TOP_NAVIGATION_HEIGHT,
  Z_INDEX,
} from '@constants/layout';

export const NewNoteHeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: ${({ theme }) => theme.WHITE};
  height: ${TOP_NAVIGATION_HEIGHT}px;
  padding: 0px ${DEFAULT_MARGIN}px;
  width: 100%;
  border-bottom: 1.2px solid ${({ theme }) => theme.LIGHT_GRAY};
  z-index: ${Z_INDEX.TITLE_HEADER};
`;
