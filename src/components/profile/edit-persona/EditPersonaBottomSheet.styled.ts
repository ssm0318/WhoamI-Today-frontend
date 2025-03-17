import styled from 'styled-components';
import { Layout } from '@design-system';

export const ConfirmButtonContainer = styled(Layout.FlexRow)`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.WHITE};
  box-shadow: 0px -1px 8px 0px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;
