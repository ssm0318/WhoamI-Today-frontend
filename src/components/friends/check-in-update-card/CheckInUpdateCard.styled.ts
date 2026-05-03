import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const CardContainer = styled(Layout.FlexCol)`
  background-color: #f8f4fc;
  border-left: 3px solid ${Colors.PRIMARY};
  border-radius: 0 12px 12px 0;
  padding: 10px 12px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
`;

export const ComponentContent = styled(Layout.FlexRow)`
  padding: 4px 0;
`;
