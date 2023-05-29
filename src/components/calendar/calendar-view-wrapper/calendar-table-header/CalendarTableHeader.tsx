import { useTranslation } from 'react-i18next';
import { Font } from '@design-system';

const DAYS_OF_WEEK = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function CalendarTableHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'calendar.table_header' });
  return (
    <thead>
      <tr>
        {DAYS_OF_WEEK.map((day) => (
          <th key={day}>
            <Font.Body type="18_semibold" textAlign="center" color="GRAY_5">
              {t(day)}
            </Font.Body>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default CalendarTableHeader;
