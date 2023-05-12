import { format } from 'date-fns';
import { Font, Layout } from '@design-system';
import { CalendarProps } from '@models/calendar';
import { DAYS_OF_WEEK } from '../Calendar.helper';
import { CalendarTable } from '../Calendar.styled';

interface WeeklyCalendarProps extends CalendarProps {
  currentWeekOfMonth: number;
  moveToPrevWeek: () => void;
  moveToNextWeek: () => void;
}

function WeeklyCalendar({
  calendarMatrix,
  currentDate,
  currentWeekOfMonth,
  moveToPrevWeek,
  moveToNextWeek,
}: WeeklyCalendarProps) {
  return (
    <Layout.FlexCol>
      <Layout.FlexRow>
        <div>
          {/* TODO: 다국어 적용 */}
          <Font.Body type="14_semibold">
            {format(currentDate, 'MMMM yyyy')} {currentWeekOfMonth + 1}
          </Font.Body>
        </div>
        <div>
          <button type="button" onClick={moveToPrevWeek}>
            {'<'}
          </button>
          <button type="button" onClick={moveToNextWeek}>
            {'>'}
          </button>
        </div>
      </Layout.FlexRow>
      <Layout.FlexCol>
        <CalendarTable>
          <thead>
            <tr>
              {DAYS_OF_WEEK.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {calendarMatrix[currentWeekOfMonth]?.map((day, i) => {
                const dayKey = `day_${i}`;
                return <th key={dayKey}>{day ? format(day, 'dd') : ''}</th>;
              })}
            </tr>
          </tbody>
        </CalendarTable>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default WeeklyCalendar;
