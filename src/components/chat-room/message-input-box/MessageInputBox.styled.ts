import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledMessageInputBox = styled(Layout.FlexCol).attrs({
  w: '100%',
  p: 8,
  rounded: 13,
  outline: 'GRAY_9',
  justifyContent: 'space-evenly',
  alignItems: 'center',
})`
  min-height: 40px;
`;

export const MessageInput = styled(TextareaAutosize)`
  width: 100%;
  border-color: transparent;
  max-height: 100px;

  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;

  ::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;
