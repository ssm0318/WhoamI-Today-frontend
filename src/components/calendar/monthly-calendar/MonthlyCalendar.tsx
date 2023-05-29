import { addMonths, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { CALENDAR_VIEW } from '@models/calendar';
import CalendarCell from '../calendar-cell/CalendarCell';
import CalendarViewWrapper from '../calendar-view-wrapper/CalendarViewWrapper';
import { getCalendarMatrix } from './MonthlyCalendar.helper';

function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarMatrix = useMemo(() => getCalendarMatrix(currentDate), [currentDate]);

  const moveToPrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const moveToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  return (
    <CalendarViewWrapper
      type={CALENDAR_VIEW.MONTHLY}
      currentDate={currentDate}
      onClickPrevBtn={moveToPrevMonth}
      onClickNextBtn={moveToNextMonth}
    >
      {calendarMatrix.map((week, i) => {
        const weekKey = `week_${i}`;
        return (
          <tr key={weekKey}>
            {week.map((date, j) => {
              const dateKey = `date_${i}_${j}`;
              return <CalendarCell key={dateKey} date={date} />;
            })}
          </tr>
        );
      })}
    </CalendarViewWrapper>
  );
}

export default MonthlyCalendar;
