import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

interface HashTagPillContainerProps {
  isSelected: boolean;
}

export const HashTagPillContainer = styled(Layout.FlexRow).attrs<HashTagPillContainerProps>(
  ({ isSelected }) => ({
    bgColor: isSelected ? 'BLACK' : 'WHITE',
    gap: 4,
    pv: 2,
    ph: 8,
    outline: isSelected ? 'WHITE' : 'LIGHT_GRAY',
    alignItems: 'center',
    rounded: 100,
  }),
)<HashTagPillContainerProps>`
  flex-shrink: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  border: 1px solid ${({ isSelected }) => (isSelected ? Colors.WHITE : Colors.LIGHT_GRAY)};
  justify-content: center;
  white-space: nowrap;
`;

export const CheckmarkBox = styled(Layout.FlexRow)`
  background-color: ${Colors.DARK_GRAY};
  border-radius: 4px;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
