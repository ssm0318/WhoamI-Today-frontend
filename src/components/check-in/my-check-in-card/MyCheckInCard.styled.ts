import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexCol).attrs({
  rounded: 12,
  pv: 12,
  ph: 16,
  w: '100%',
  gap: 12,
})`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #eee6f4;
`;
