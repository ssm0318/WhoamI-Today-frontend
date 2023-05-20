import { addWeeks, subWeeks } from 'date-fns';
import { useMemo, useState } from 'react';
import CalendarCell from '../calendar-cell/CalendarCell';
import CalendarViewWrapper from '../calendar-view-wrapper/CalendarViewWrapper';
import { getCalendarTitle, getCalendarWeek } from './WeeklyCalendar.helper';

function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarWeek = useMemo(() => getCalendarWeek(currentDate), [currentDate]);
  const calendarTitle = useMemo(() => getCalendarTitle(currentDate), [currentDate]);

  const moveToPrevWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  };

  const moveToNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  return (
    <CalendarViewWrapper
      title={calendarTitle}
      onClickPrevBtn={moveToPrevWeek}
      onClickNextBtn={moveToNextWeek}
    >
      <tr>
        {calendarWeek.map((date, i) => {
          const dateKey = `date_${i}`;
          return <CalendarCell key={dateKey} date={date} />;
        })}
      </tr>
    </CalendarViewWrapper>
  );
}

export default WeeklyCalendar;
