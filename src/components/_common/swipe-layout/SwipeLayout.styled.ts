import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledSwipeLayout = styled(Layout.FlexRow)`
  position: relative;
  width: 100%;
`;

interface StyledSwipeProps {
  distance?: number;
}

export const StyledSwipeItem = styled.div.attrs<StyledSwipeProps>(({ distance }) => ({
  style: {
    transform: distance && distance > 0 ? `translateX(${-distance}px)` : '',
  },
}))<StyledSwipeProps>`
  width: 100%;
  z-index: 1;
  background-color: ${({ theme }) => theme.WHITE};
`;

export const StyledRightContent = styled.div.attrs<StyledSwipeProps>(({ distance }) => ({
  style: {
    width: distance && distance > 0 ? `${distance}px` : '',
  },
}))<StyledSwipeProps>`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
  margin-top: 1px;
  height: 44px;
`;
