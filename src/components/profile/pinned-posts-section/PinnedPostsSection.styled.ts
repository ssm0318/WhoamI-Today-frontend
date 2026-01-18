import styled from 'styled-components';
import { Layout } from '@design-system';

export const PinnedPostsSectionWrapper = styled(Layout.FlexRow)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: ${({ theme }) => theme.WHITE};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;
