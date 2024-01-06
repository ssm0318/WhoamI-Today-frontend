import styled from 'styled-components';
import { CommonInput } from '@design-system';

export const SearchInput = styled(CommonInput)`
  background: transparent;
  border-bottom: none;
  box-shadow: none;
  padding: 0;

  ::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;

export const SearchCancel = styled.button`
  color: ${({ theme }) => theme.DARK};
  padding: 8px 12px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  flex-shrink: 0;
`;
