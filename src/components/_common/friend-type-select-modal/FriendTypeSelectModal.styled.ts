import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: hidden;
  overscroll-behavior-y: none;
`;

export const Background = styled(Layout.Absolute)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.DIM};
`;

export const Body = styled(Layout.Absolute)`
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 50%;
  border-radius: 12.195px;
  background-color: ${({ theme }) => theme.WHITE};
  width: 80%;
  max-width: calc(100% - 40px);
`;

export const ButtonContainer = styled(Layout.FlexRow)`
  border-top: 1px solid ${({ theme }) => theme.MEDIUM_GRAY};
  width: 100%;
`;

export const Button = styled(Layout.FlexRow)<{
  hasBorderRight?: boolean;
}>`
  border-right: ${({ hasBorderRight = true, theme }) =>
    hasBorderRight && `1px solid ${theme.MEDIUM_GRAY}`};
  align-items: center;
  justify-content: center;
  width: 100%;
`;
