import styled from 'styled-components';

export const FLOATING_BUTTON_SIZE = 60;

export const StyledFloatingButton = styled.button`
  position: absolute;
  z-index: 500;
  bottom: 100px;
  right: 20px;
  width: ${FLOATING_BUTTON_SIZE}px;
  height: ${FLOATING_BUTTON_SIZE}px;
  background-color: ${({ theme }) => theme.SECONDARY};
  border-radius: 50%;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
`;
