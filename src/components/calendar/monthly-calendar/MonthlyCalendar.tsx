import { format } from 'date-fns';
import { Layout } from '@design-system';
import { CalendarProps } from '@models/calendar';
import CalendarHeader from '../calendar-header/CalendarHeader';
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
      <CalendarHeader
        title={format(currentDate, 'MMMM yyyy')}
        onClickPrevBtn={moveToPrevMonth}
        onClickNextBtn={moveToNextMonth}
      />
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
