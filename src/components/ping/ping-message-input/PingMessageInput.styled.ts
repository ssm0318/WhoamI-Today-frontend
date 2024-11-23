import styled from 'styled-components';

export const StyledTextInput = styled.input`
  outline: 0;
  margin: 0;
  border: 0;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;

  width: 100%;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  color: ${({ theme }) => theme.LIGHT};

  ::placeholder {
    color: ${({ theme }) => theme.LIGHT};
  }
`;
