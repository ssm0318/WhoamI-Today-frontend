import styled from 'styled-components';
import { MAX_WINDOW_WIDTH, TITLE_HEADER_HEIGHT, Z_INDEX } from '@constants/layout';

export const SubHeaderWrapper = styled.header`
  z-index: ${Z_INDEX.TITLE_HEADER};
  position: fixed;
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: white;
  width: 100%;
  height: ${TITLE_HEADER_HEIGHT}px;
  border-bottom: 1.2px solid ${({ theme }) => theme.PRIMARY};
`;
