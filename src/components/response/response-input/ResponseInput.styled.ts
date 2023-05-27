import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const ResponseTextInput = styled(TextareaAutosize)`
  width: 100%;
  font-size: 18px;

  ::placeholder {
    color: #a0a0a0;
  }
`;
