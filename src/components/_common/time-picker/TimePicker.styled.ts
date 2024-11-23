import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexRow)`
  padding: 1rem;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const TimePickerWrapper = styled(Layout.FlexRow)``;

export const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  width: 48px;
  text-align: center;
`;

export const Separator = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const PeriodButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
`;
