import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexRow)`
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const WeekPickerWrapper = styled(Layout.FlexRow)`
  flex-wrap: wrap;
`;

export const DayButton = styled.button<{
  selected: boolean;
  disabled: boolean;
}>`
  min-width: 40px;
  height: 40px;
  border-radius: 20px;
  margin: 4px;
  padding: 0 12px;
  border: 1px solid ${({ selected }) => (selected ? '#3182ce' : '#e2e8f0')};
  background: ${({ selected }) => (selected ? '#3182ce' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : 'inherit')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ selected, disabled }) =>
      disabled
        ? selected
          ? '#3182ce'
          : 'transparent'
        : selected
        ? '#2c5282'
        : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background: ${({ selected, disabled }) =>
      disabled
        ? selected
          ? '#3182ce'
          : 'transparent'
        : selected
        ? '#2c5282'
        : 'rgba(0, 0, 0, 0.1)'};
  }
`;
