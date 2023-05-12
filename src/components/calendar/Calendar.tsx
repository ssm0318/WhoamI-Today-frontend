import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import { useCalendarHandlers } from './_hooks/useCalendarHandlers';
import MonthlyCalendar from './monthly-calendar/MonthlyCalendar';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';

function Calendar() {
  const calendarView = useBoundStore((state) => state.calendarView);
  const {
    currentDate,
    currentWeekOfMonth,
    calendarMatrix,
    moveToPrevWeek,
    moveToNextWeek,
    moveToPrevMonth,
    moveToNextMonth,
  } = useCalendarHandlers();

  return calendarView === CALENDAR_VIEW.WEEKLY ? (
    <WeeklyCalendar
      currentDate={currentDate}
      currentWeekOfMonth={currentWeekOfMonth}
      calendarMatrix={calendarMatrix}
      moveToPrevWeek={moveToPrevWeek}
      moveToNextWeek={moveToNextWeek}
    />
  ) : (
    <MonthlyCalendar
      currentDate={currentDate}
      calendarMatrix={calendarMatrix}
      moveToPrevMonth={moveToPrevMonth}
      moveToNextMonth={moveToNextMonth}
    />
  );
}

export default Calendar;
