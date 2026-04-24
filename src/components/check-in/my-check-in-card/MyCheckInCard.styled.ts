import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexCol).attrs({
  rounded: 12,
  // Reduced ~33% from the previous pv/gap=12 so the self-card's sections
  // (username row, thought pill, song, pinned link) stack more densely.
  pv: 8,
  ph: 16,
  w: '100%',
  gap: 8,
})`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #eee6f4;
`;
