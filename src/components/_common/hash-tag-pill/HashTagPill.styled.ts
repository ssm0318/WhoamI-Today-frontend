import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

interface HashTagPillContainerProps {
  isSelected: boolean;
}

export const HashTagPillContainer = styled(Layout.FlexRow).attrs<HashTagPillContainerProps>(
  ({ isSelected }) => ({
    bgColor: isSelected ? 'LIGHT_GRAY' : 'WHITE',
    gap: 2,
    pv: 2,
    ph: 8,
    alignItems: 'center',
    rounded: 100,
  }),
)<HashTagPillContainerProps>`
  flex-shrink: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  border: 1px solid ${Colors.BLACK};
  justify-content: center;
  white-space: nowrap;
`;
