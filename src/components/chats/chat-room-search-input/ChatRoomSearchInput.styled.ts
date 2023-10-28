import styled from 'styled-components';
import { CommonInput, Layout } from '@design-system';

export const StyledChatRoomSearchInputArea = styled(Layout.LayoutBase).attrs({
  w: '100%',
  p: 16,
})`
  border-bottom: 1px solid ${({ theme }) => theme.GRAY_2};
`;

export const StyledSearchInput = styled(CommonInput)`
  background: transparent;
  border-bottom: none;
  box-shadow: none;
  padding: 0;

  ::placeholder {
    color: ${({ theme }) => theme.GRAY_12};
  }
`;
