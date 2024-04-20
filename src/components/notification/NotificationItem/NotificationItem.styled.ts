import styled from 'styled-components';
import { Layout } from '@design-system';

export const NotificationContainer = styled(Layout.FlexRow)`
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT};
`;

export const NotificationContent = styled(Layout.FlexRow)`
  position: relative;
`;
