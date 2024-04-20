import styled, { css } from 'styled-components';
import { DEFAULT_MARGIN, MAX_WINDOW_WIDTH, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEX.MODAL_CONTAINER};
  overflow-y: hidden;
  overscroll-behavior-y: none;
`;

export const Background = styled(Layout.Absolute)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.DIM};
`;

const MAX_WIDTH = MAX_WINDOW_WIDTH - 2 * DEFAULT_MARGIN;

export interface BodyProps {
  position: 'top' | 'center' | 'bottom';
}

export const Body = styled(Layout.Absolute)<BodyProps>`
  ${({ position }) =>
    position === 'center' &&
    css`
      top: 50%;
      transform: translate(-50%, -50%);
    `}

  ${({ position }) =>
    position === 'bottom' &&
    css`
      bottom: 10px;
      transform: translateX(-50%);
    `}

  ${({ position }) =>
    position === 'top' &&
    css`
      top: 10px;
      transform: translateX(-50%);
    `}
    
  left: 50%;
  padding: 32px 24.5px 31.62px 25px;
  border-radius: 12.195px;
  background-color: ${({ theme }) => theme.WHITE};
  width: 70%;
  max-width: ${MAX_WIDTH}px;
`;
