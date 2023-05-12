import { format } from 'date-fns';
import { Font, Layout } from '@design-system';
import { CalendarProps } from '@models/calendar';
import { CalendarTable } from '../Calendar.styled';
import { DAYS_OF_WEEK } from './MonthlyCalendar.helper';

interface MonthlyCalendarProps extends CalendarProps {
  moveToPrevMonth: () => void;
  moveToNextMonth: () => void;
}

function MonthlyCalendar({
  calendarMatrix,
  currentDate,
  moveToPrevMonth,
  moveToNextMonth,
}: MonthlyCalendarProps) {
  return (
    <Layout.FlexCol>
      <Layout.FlexRow>
        <div>
          <Font.Body type="14_semibold">{format(currentDate, 'MMMM yyyy')}</Font.Body>
        </div>
        <div>
          <button type="button" onClick={moveToPrevMonth}>
            {'<'}
          </button>
          <button type="button" onClick={moveToNextMonth}>
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
            {calendarMatrix.map((week, i) => {
              const weekKey = `week_${i}`;
              return (
                <tr key={weekKey}>
                  {week.map((day, j) => {
                    const dayKey = `day_${i}_${j}`;
                    return <th key={dayKey}>{day ? format(day, 'dd') : ''}</th>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </CalendarTable>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default MonthlyCalendar;
