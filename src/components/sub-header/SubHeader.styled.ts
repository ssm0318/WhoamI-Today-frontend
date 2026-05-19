import styled from 'styled-components';
import { DEFAULT_MARGIN, MAX_WINDOW_WIDTH, TITLE_HEADER_HEIGHT, Z_INDEX } from '@constants/layout';

export const SubHeaderWrapper = styled.header`
  z-index: ${Z_INDEX.TITLE_HEADER};
  position: fixed;
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: white;
  width: 100%;
  height: ${TITLE_HEADER_HEIGHT}px;
  border-bottom: 1.2px solid ${({ theme }) => theme.LIGHT_GRAY};

  .sub-header-inner {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) 36px;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px ${DEFAULT_MARGIN}px;
  }

  .sub-header-side {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .sub-header-title {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
