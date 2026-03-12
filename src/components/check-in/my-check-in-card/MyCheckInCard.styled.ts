import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexRow).attrs({
  rounded: 12,
  p: 12,
  w: '100%',
})`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #eee6f4;
`;
