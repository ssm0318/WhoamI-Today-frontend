import styled from 'styled-components';
import { Layout, TextArea, Typo } from '@design-system';

export const SendPromptModalContainer = styled.div`
  padding: 16px 16px 0 16px;
  background-color: ${({ theme }) => theme.WHITE};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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
  flex: 1;
  width: 100%;
  padding-bottom: 200px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FixedBottomSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.WHITE};

  border-top: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;

export const MessageInput = styled(TextArea)`
  outline: none;
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: none;
  background-color: ${({ theme }) => theme.WHITE};
`;
