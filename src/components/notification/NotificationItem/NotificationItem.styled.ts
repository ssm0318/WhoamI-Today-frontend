import styled from 'styled-components';
import { Layout } from '@design-system';

export const NotificationContent = styled(Layout.FlexRow)<{
  border?: boolean;
}>`
  border-bottom: ${({ theme, border }) => (border ? `1px solid ${theme.LIGHT}` : 'none')};
`;

export const NotificationProfileContainer = styled(Layout.FlexRow)`
  position: relative;
`;
