import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledUpdatedFriendItem = styled(Layout.FlexRow)`
  padding-bottom: 4px;
  border-bottom: 1px ${({ theme }) => theme.LIGHT} solid;
`;

export const StyledProfileArea = styled.div`
  display: flex;
  width: 100%;
  max-width: 50%;
  justify-content: space-between;
  align-items: center;
`;
