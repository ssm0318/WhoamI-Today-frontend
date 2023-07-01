import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const CommentInput = styled(TextareaAutosize)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.GRAY_1};
  border-radius: 4px;
  font-size: 14px;

  ::placeholder {
    color: ${({ theme }) => theme.GRAY_12};
  }
`;
