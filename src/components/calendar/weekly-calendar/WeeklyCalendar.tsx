import { format } from 'date-fns';
import { Layout } from '@design-system';
import { CalendarProps } from '@models/calendar';
import CalendarHeader from '../calendar-header/CalendarHeader';
import CalendarTable, { CalendarCell } from '../calendar-table/CalendarTable';

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
      <CalendarHeader
        title={`${format(currentDate, 'MMMM yyyy')} ${currentWeekOfMonth + 1}`}
        onClickPrevBtn={moveToPrevWeek}
        onClickNextBtn={moveToNextWeek}
      />
      <Layout.FlexCol>
        <CalendarTable>
          <tr>
            {calendarMatrix[currentWeekOfMonth]?.map((date, i) => {
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
