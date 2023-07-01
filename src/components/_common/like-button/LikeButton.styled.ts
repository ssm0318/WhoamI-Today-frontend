import styled from 'styled-components';

interface IconButtonProps {
  m: number;
}

export const IconButton = styled.button<IconButtonProps>`
  margin: ${({ m }) => `${m || 0}px`};
`;
