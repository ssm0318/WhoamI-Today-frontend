import styled from 'styled-components';
import { MAX_WINDOW_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: white;
  height: ${TITLE_HEADER_HEIGHT}px;
  width: 100%;
`;
