import styled from 'styled-components';
import { Layout } from '@design-system';

export const NotificationContent = styled(Layout.FlexRow)`
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT};
`;

export const NotificationProfileContainer = styled(Layout.FlexRow)`
  position: relative;
`;
