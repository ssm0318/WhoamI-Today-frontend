import styled from 'styled-components';
import { MAX_WINDOW_WIDTH } from '@constants/layout';

export const StyledNewFloatingButtonWrapper = styled.div`
  max-width: ${MAX_WINDOW_WIDTH}px;
  width: 100%;
  position: fixed;
  z-index: 500;
  bottom: 100px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
`;

export const StyledNewFloatingButton = styled.button`
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.SECONDARY};
  border-radius: 50%;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
`;
