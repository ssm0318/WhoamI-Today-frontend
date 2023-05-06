import styled from 'styled-components';
import {
  BOTTOM_TABBAR_HEIGHT,
  DEFAULT_MARGIN,
  MAX_WINDOW_WIDTH,
  TOP_NAVIGATION_HEIGHT,
} from '@constants/layout';
import { Layout } from '@design-system';

export const RootContainer = styled(Layout.FlexCol)`
  max-width: ${MAX_WINDOW_WIDTH}px;
  overflow-y: auto;
  position: relative;
`;

export const MainWrapper = styled.main`
  height: 100%;
  background-color: ${({ theme }) => theme.BASIC_WHITE};
  padding: ${TOP_NAVIGATION_HEIGHT}px ${DEFAULT_MARGIN}px ${BOTTOM_TABBAR_HEIGHT}px;
`;
