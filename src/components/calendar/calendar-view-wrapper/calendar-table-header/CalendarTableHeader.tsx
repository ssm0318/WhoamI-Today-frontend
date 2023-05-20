import { Font } from '@design-system';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function CalendarTableHeader() {
  return (
    <thead>
      <tr>
        {DAYS_OF_WEEK.map((day) => (
          <th key={day}>
            <Font.Body type="18_semibold" textAlign="center" color="GRAY_5">
              {day}
            </Font.Body>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default CalendarTableHeader;
