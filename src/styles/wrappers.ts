import styled from 'styled-components';
import { Layout } from '@design-system';

export const RootContainer = styled(Layout.FlexCol)`
  max-width: 500px;
  overflow-y: auto;
`;

export const MainWrapper = styled.main`
  padding-top: 50px;
  padding-bottom: 80px;
  height: 100%;
  background-color: ${({ theme }) => theme.BASIC_WHITE};
`;
