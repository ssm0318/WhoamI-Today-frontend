import styled from 'styled-components';

interface IconButtonProps {
  m: number;
  size: number;
}

export const IconButton = styled.button<IconButtonProps>`
  margin: ${({ m }) => `${m || 0}px`};
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`;
