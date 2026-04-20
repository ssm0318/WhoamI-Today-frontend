import styled, { keyframes } from 'styled-components';
import { Z_INDEX } from '@constants/layout';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Dim = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX.MODAL_CONTAINER};
  animation: ${fadeIn} 0.15s ease-in;
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.25);
  border-left-color: #ffffff;
  animation: ${rotate} 1.1s linear infinite;
`;
