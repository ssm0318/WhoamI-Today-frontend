import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledFriendItem = styled(Layout.FlexRow)`
  & + & {
    border-top: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  }
`;
