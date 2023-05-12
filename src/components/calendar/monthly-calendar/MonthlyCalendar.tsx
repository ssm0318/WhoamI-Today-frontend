import { format } from 'date-fns';
import { Layout } from '@design-system';
import { CalendarProps } from '@models/calendar';
import CalendarHeader from '../calendar-header/CalendarHeader';
import CalendarTable, { CalendarCell } from '../calendar-table/CalendarTable';

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
