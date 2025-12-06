import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const StyledSpotifyMusic = styled.button`
  display: flex;
`;

export const SkeletonBox = styled.div`
  width: 120px;
  height: 14px;
  background-color: ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;
