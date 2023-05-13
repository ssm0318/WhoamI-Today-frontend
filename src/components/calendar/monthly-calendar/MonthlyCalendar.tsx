import { addMonths, format, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { Layout } from '@design-system';
import CalendarHeader from '../calendar-header/CalendarHeader';
import CalendarTable, { CalendarCell } from '../calendar-table/CalendarTable';
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
    <Layout.FlexCol>
      <CalendarHeader
        title={format(currentDate, 'MMMM yyyy')}
        onClickPrevBtn={moveToPrevMonth}
        onClickNextBtn={moveToNextMonth}
      />
      <Layout.FlexCol>
        <CalendarTable>
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
        </CalendarTable>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default MonthlyCalendar;
