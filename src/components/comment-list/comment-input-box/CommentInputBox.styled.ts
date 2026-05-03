import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { Layout } from '@design-system';

export const CommentInputWrapper = styled(Layout.FlexCol)`
  border-top: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;

export const CommentInput = styled(TextareaAutosize)`
  width: 100%;
  border-radius: 15px;
  padding: 6px 4px;
  border: none;
  font-size: 14px;

  ::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;
