import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const CommentInput = styled(TextareaAutosize)`
  width: 100%;
  border-radius: 18px;
  padding: 6px 12px;
  border: none;
  font-size: 16px;

  ::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;
