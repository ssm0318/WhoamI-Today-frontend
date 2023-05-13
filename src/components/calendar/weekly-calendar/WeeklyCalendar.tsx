import { addWeeks, format, getWeekOfMonth, subWeeks } from 'date-fns';
import { useMemo, useState } from 'react';
import { Layout } from '@design-system';
import CalendarHeader from '../calendar-header/CalendarHeader';
import CalendarTable, { CalendarCell } from '../calendar-table/CalendarTable';
import { getCalendarWeek } from './WeeklyCalendar.helper';

function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarWeek = useMemo(() => getCalendarWeek(currentDate), [currentDate]);

  const moveToPrevWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  };

  const moveToNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  return (
    <Layout.FlexCol>
      <CalendarHeader
        title={`${format(currentDate, 'MMMM yyyy')} ${getWeekOfMonth(currentDate)} week`}
        onClickPrevBtn={moveToPrevWeek}
        onClickNextBtn={moveToNextWeek}
      />
      <Layout.FlexCol>
        <CalendarTable>
          <tr>
            {calendarWeek.map((date, i) => {
              const dateKey = `date_${i}`;
              return <CalendarCell key={dateKey} date={date} />;
            })}
          </tr>
        </CalendarTable>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default WeeklyCalendar;
