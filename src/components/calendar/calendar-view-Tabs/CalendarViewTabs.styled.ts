import styled from 'styled-components';
import { Colors } from '@design-system';

export const CalendarViewTabs = styled.div`
  box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 67px;
  height: 34px;
`;

export const CalendarViewTab = styled.button`
  border-radius: 4px;
  width: 32px;
  height: 32px;
  margin: 1px 0 1px 1px;

  &.active {
    box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.1);
    background-color: ${Colors.BASIC_WHITE};
  }
`;
