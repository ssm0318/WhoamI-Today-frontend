import styled from 'styled-components';
import { Layout } from '@design-system';

export const ScrollableFilterRow = styled(Layout.FlexRow)`
  overflow-x: auto;
  flex-wrap: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
