import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: ${BOTTOM_TABBAR_HEIGHT}px;
  cursor: pointer;
`;
