import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  background-color: #eee6f4;
`;

export const StarIconContainer = styled(Layout.FlexRow).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${Colors.SECONDARY};
`;
