import styled from 'styled-components';
import { Layout, TextArea, Typo } from '@design-system';

export const SendPromptModalContainer = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.WHITE};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: hidden;
`;

export const SendPromptModalFriendListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export const SendPromptModalTitle = styled(Typo)`
  padding: 16px 0 12px 0;
`;

export const SendPromptModalFriendList = styled(Layout.FlexCol)`
  overflow-y: auto;
`;

export const MessageInput = styled(TextArea)`
  outline: none;
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: none;
`;
