import styled from 'styled-components';
import { Layout } from '@design-system';

export const SocialMetricsSectionWrapper = styled(Layout.FlexCol)`
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.GRAY_14};
  border-radius: 12px;
`;
