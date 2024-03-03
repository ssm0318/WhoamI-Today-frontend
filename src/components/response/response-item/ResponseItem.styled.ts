import styled from 'styled-components';
import { Layout } from '@design-system';

export const ReplyWrapper = styled(Layout.FlexCol)`
  border-left: 2px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-bottom: 2px solid ${({ theme }) => theme.LIGHT_GRAY};
`;
