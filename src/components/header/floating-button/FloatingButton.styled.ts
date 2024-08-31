import styled from 'styled-components';

export const StyledFloatingButton = styled.button`
  position: absolute;
  z-index: 500;
  bottom: 100px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.SECONDARY};
  border-radius: 50%;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
`;
