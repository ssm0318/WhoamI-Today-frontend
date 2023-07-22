import styled from 'styled-components';
import { Layout } from '@design-system';

export const Response = styled(Layout.FlexCol).attrs({
  w: '100%',
})``;

export const ResponseFooter = styled(Layout.FlexRow).attrs({
  w: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  pt: 6,
  pr: 8,
  pb: 6,
  pl: 14,
})``;
