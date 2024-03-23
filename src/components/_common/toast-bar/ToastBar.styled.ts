import styled, { css, keyframes } from 'styled-components';
import { Layout } from '@design-system';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export type AnimationState = 'show' | 'hide' | null;

export const AnimatedToastBarContainer = styled(Layout.FlexRow)<{
  state: AnimationState;
}>`
  ${({ state }) =>
    state === 'show' &&
    css`
      animation: ${fadeIn} 0.5s ease-out forwards;
    `}
  ${({ state }) =>
    state === 'hide' &&
    css`
      animation: ${fadeOut} 0.5s ease-out forwards;
    `}
`;
