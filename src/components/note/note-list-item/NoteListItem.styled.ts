import styled from 'styled-components';
import { Layout } from '@design-system';

export const NoteListItemWrapper = styled(Layout.FlexCol)`
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT};
`;
