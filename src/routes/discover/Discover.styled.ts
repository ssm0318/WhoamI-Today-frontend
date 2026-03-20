import styled, { createGlobalStyle, css } from 'styled-components';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
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
  width: 100%;
  max-width: 100%;
  overflow: hidden;
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

export const HideScrollbarGlobalStyle = createGlobalStyle`
  #${MAIN_SCROLL_CONTAINER_ID} {
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
`;
