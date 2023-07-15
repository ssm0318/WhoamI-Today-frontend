import styled from 'styled-components';
import { Layout } from '@design-system';

export const ContentWrapper = styled(Layout.FlexRow).attrs({
  w: '100%',
  justifyContent: 'space-between',
})`
  span {
    padding: 6px 14px 6px 14px;
  }

  button {
    padding: 6px 12px;
  }
`;
