import styled from 'styled-components';
import { CommonInput } from '@design-system';

export const SearchInput = styled(CommonInput)`
  background: transparent;
  border-bottom: none;
  box-shadow: none;
  padding: 0;

  ::placeholder {
    color: ${({ theme }) => theme.GRAY_12};
  }
`;
