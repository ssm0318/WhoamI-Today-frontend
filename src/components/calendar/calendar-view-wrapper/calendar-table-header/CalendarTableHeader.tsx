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

export default CalendarTableHeader;
