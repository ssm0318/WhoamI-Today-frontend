import styled from 'styled-components';
import { ColorKeys } from '@design-system';

interface IconProps {
  backgroundColor?: ColorKeys;
  size: number;
}

export const StyledIcon = styled.button<IconProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  ${({ backgroundColor, theme }) => `
    ${
      backgroundColor &&
      `
      background-color: ${theme[backgroundColor]}; 
      border-radius: 50%;
    `
    }
  `}
`;
