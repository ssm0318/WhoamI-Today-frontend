import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const InputContainer = styled(TextareaAutosize)`
  width: 100%;
  height: 100%;
  margin-left: 8px;
  font-size: 18px;
  ::placeholder {
    color: #a0a0a0;
  }

  :disabled {
    background-color: ${({ theme }) => theme.WHITE};
    opacity: 1;
  }
`;
