import styled from 'styled-components';
import { MAX_WINDOW_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';

export const RootContainer = styled(Layout.FlexCol)`
  max-width: ${MAX_WINDOW_WIDTH}px;
  overflow-y: auto;
  position: relative;
`;

export const MainWrapper = styled(Layout.FlexCol)`
  height: 100%;
  width: 100%;
`;
