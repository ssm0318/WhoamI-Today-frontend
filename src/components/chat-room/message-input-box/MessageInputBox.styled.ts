import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledMessageInputBox = styled(Layout.FlexRow).attrs({
  w: '100%',
  ph: 8,
  pb: 8,
  rounded: 13,
  outline: 'GRAY_9',
  justifyContent: 'space-evenly',
  alignItems: 'flex-end',
})`
  min-height: 40px;
  max-height: 60px;
`;

export const MessageInput = styled(TextareaAutosize)`
  width: 100%;
  font-size: 12px;

  ::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;
