import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexRow)`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const WeekPickerWrapper = styled(Layout.FlexRow)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  max-width: 400px;
`;

export const DayButton = styled.button<{
  selected: boolean;
}>`
  aspect-ratio: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid ${({ selected, theme }) => (selected ? theme.UPDATED : theme.LIGHT_GRAY)};
  background: ${({ selected, theme }) => (selected ? theme.UPDATED : theme.WHITE)};
  color: ${({ selected, theme }) => (selected ? theme.WHITE : theme.DARK_GRAY)};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:active {
    background: ${({ selected, theme }) => (selected ? theme.UPDATED : theme.WHITE)};
  }
`;
