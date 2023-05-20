import { format } from 'date-fns';
import { Font } from '@design-system';

interface CalendarCellProps {
  date: Date | null;
}

function CalendarCell({ date }: CalendarCellProps) {
  return date ? (
    <td>
      <Font.Body type="14_semibold" color="BASIC_WHITE" textAlign="center">
        {format(date, 'dd')}
      </Font.Body>
    </td>
  ) : (
    <td className="empty_cell" />
  );
}

export default CalendarCell;
