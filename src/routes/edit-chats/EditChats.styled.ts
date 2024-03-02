import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

export const StyledBottomArea = styled(Layout.Absolute)`
  box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.16);
  height: ${BOTTOM_TABBAR_HEIGHT}px;
`;
