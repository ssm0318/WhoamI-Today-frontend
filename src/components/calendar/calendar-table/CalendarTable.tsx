import { format } from 'date-fns';
import { ReactNode } from 'react';
import { StyledCalendarTable } from './CalendarTable.styled';

interface CalendarTableProps {
  children: ReactNode;
}

export default function CalendarTable({ children }: CalendarTableProps) {
  return (
    <StyledCalendarTable>
      <CalendarTableHeader />
      <tbody>{children}</tbody>
    </StyledCalendarTable>
  );
}

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function CalendarTableHeader() {
  return (
    <thead>
      <tr>
        {DAYS_OF_WEEK.map((day) => (
          <th key={day}>{day}</th>
        ))}
      </tr>
    </thead>
  );
}

interface CalendarCellProps {
  date: Date | null;
}

export function CalendarCell({ date }: CalendarCellProps) {
  return <td>{date ? format(date, 'dd') : ''}</td>;
}
