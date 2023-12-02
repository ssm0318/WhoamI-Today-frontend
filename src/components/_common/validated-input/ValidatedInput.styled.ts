import styled from 'styled-components';

const StyledValidatedInput = styled.div`
  width: 100%;
  margin-bottom: 45px;

  span {
    display: block;
  }

  input + button {
    padding-right: 10px;
  }

  button {
    position: absolute;
    right: 0;
    margin-top: 6px;
    margin-right: 20px;
  }
`;

export default StyledValidatedInput;
