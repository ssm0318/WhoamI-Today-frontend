import styled from 'styled-components';
import { Layout, Typo } from '@design-system';

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
