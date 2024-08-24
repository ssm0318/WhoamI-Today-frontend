import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { Layout } from '@design-system';

export const CommentInputWrapper = styled(Layout.FlexCol)`
  border-top: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;

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
