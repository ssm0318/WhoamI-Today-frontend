import styled from 'styled-components';

const StyledValidatedInput = styled.div`
  width: 100%;

  span {
    color: ${({ theme }) => theme.ERROR};
  }
`;

export default StyledValidatedInput;
