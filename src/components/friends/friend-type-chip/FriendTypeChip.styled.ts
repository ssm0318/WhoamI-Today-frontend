import styled from 'styled-components';
import { Layout } from '@design-system';

interface ChipContainerProps {
  isSelected: boolean;
}

export const ChipContainer = styled(Layout.FlexRow).attrs<ChipContainerProps>(({ isSelected }) => ({
  bgColor: isSelected ? 'PRIMARY' : 'WHITE',
  pv: 8,
  ph: 12,
  outline: 'PRIMARY',
  alignItems: 'center',
  rounded: 100,
}))<ChipContainerProps>`
  flex-shrink: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;
