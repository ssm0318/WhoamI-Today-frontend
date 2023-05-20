import styled from 'styled-components';
import { Colors } from '@design-system';

export const StyledCalendarTable = styled.table`
  width: 100%;
  margin-top: 33px;
  table-layout: fixed;
  empty-cells: hide;

  td {
    border: 6px solid ${Colors.BACKGROUND_COLOR};
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;

    &:after {
      display: block;
      padding-bottom: 100%;
      content: '';
    }

    &.empty_cell {
      background-color: ${Colors.BACKGROUND_COLOR};
      visibility: hidden;
    }

    > span {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0);
      margin-bottom: 4px;
    }
  }
`;
