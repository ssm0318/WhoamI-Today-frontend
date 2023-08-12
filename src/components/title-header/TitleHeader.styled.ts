import styled from 'styled-components';
import { MAX_WINDOW_WIDTH, Z_INDEX } from '@constants/layout';

export const HeaderWrapper = styled.header`
  z-index: ${Z_INDEX.TITLE_HEADER};
  position: fixed;
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: white;
  width: 100%;
`;
