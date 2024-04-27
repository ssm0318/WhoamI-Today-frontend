import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const NoteInput = styled(TextareaAutosize)`
  width: 100%;
  font-size: 16px;
  border: none;

  ::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;
