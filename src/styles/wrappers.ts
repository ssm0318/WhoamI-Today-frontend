import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, DEFAULT_MARGIN, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

export const RootContainer = styled(Layout.FlexCol)`
  max-width: 500px;
  overflow-y: auto;
`;

export const MainWrapper = styled.main`
  height: 100%;
  background-color: ${({ theme }) => theme.BASIC_WHITE};
  padding: ${TOP_NAVIGATION_HEIGHT}px ${DEFAULT_MARGIN}px ${BOTTOM_TABBAR_HEIGHT}px;
`;
