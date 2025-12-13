import styled from 'styled-components';
import { Layout } from '@design-system';

interface ChipContainerProps {
  isSelected: boolean;
}

export const ChipContainer = styled(Layout.FlexRow).attrs<ChipContainerProps>(({ isSelected }) => ({
  bgColor: isSelected ? 'LIGHT_GRAY' : 'WHITE',
  gap: 4,
  pv: 2,
  ph: 8,
  outline: 'BLACK',
  alignItems: 'center',
  rounded: 20,
}))<ChipContainerProps>`
  flex-shrink: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;
