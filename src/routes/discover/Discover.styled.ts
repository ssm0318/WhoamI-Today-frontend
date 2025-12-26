import styled, { css } from 'styled-components';
import { Layout } from '@design-system';

export const ScrollableFilterRow = styled(Layout.FlexRow)`
  overflow-x: auto;
  flex-wrap: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const AnimatedCardWrapper = styled.div<{ $isAnimating: boolean }>`
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  transform: translateX(0);
  opacity: 1;

  ${({ $isAnimating }) =>
    $isAnimating &&
    css`
      transform: translateX(-100%);
      opacity: 0;
    `}
`;
