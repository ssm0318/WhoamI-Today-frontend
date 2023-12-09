import styled from 'styled-components';

interface DefaultProfileProps {
  size: number;
}

export const NonShrinkWrapper = styled.div`
  flex-shrink: 0;
`;

export const DefaultProfile = styled.div<DefaultProfileProps>`
  background-color: ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;
