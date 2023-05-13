import { format } from 'date-fns';

interface CalendarCellProps {
  date: Date | null;
}

function CalendarCell({ date }: CalendarCellProps) {
  return <td>{date ? format(date, 'dd') : ''}</td>;
}

export default CalendarCell;
