import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

interface ChipContainerProps {
  isSelected: boolean;
}

export const ChipContainer = styled(Layout.FlexRow).attrs<ChipContainerProps>(({ isSelected }) => ({
  bgColor: isSelected ? 'PRIMARY' : 'WHITE',
  gap: 4,
  pv: 8,
  ph: 12,
  outline: 'PRIMARY',
  alignItems: 'center',
  rounded: 20,
}))<ChipContainerProps>`
  flex-shrink: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

interface StarIconContainerProps {
  isSelected: boolean;
}

export const StarIconContainer = styled(Layout.FlexRow).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})<StarIconContainerProps>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${Colors.SECONDARY};
`;
