import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledSwipeLayout = styled(Layout.FlexRow)`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

interface StyledSwipedItemProps {
  distance?: number;
}

export const StyledSwipedItem = styled.div.attrs<StyledSwipedItemProps>(({ distance }) => ({
  style: {
    transform: distance ? `translateX(${-distance}px)` : '',
  },
}))<StyledSwipedItemProps>`
  width: 100%;
  z-index: 1;
  background-color: ${({ theme }) => theme.WHITE};
`;

type StyledSwipeContentProps = Required<StyledSwipedItemProps>;

export const StyledLeftContent = styled.div.attrs<StyledSwipeContentProps>(({ distance }) => ({
  style: {
    width: distance <= 0 ? `${-distance}px` : '',
  },
}))<StyledSwipeContentProps>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

export const StyledRightContent = styled.div.attrs<StyledSwipeContentProps>(({ distance }) => ({
  style: {
    width: distance >= 0 ? `${distance}px` : '',
  },
}))<StyledSwipeContentProps>`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
`;
