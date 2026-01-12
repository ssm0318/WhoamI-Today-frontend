import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  background-color: #eee6f4;
  box-sizing: border-box;
  width: calc(100% - 32px);
  min-width: 0;
  flex-shrink: 0;
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
