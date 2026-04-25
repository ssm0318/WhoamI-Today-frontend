import styled from 'styled-components';

export const TabsRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.WHITE};
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;

export const TabButton = styled.button<{ selected: boolean }>`
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid ${({ theme, selected }) => (selected ? '#8700FF' : theme.LIGHT_GRAY)};
  background: ${({ selected }) => (selected ? '#F3E8FF' : 'white')};
  color: ${({ theme, selected }) => (selected ? '#8700FF' : theme.DARK)};
  cursor: pointer;
`;
