import { addMonths, isSameDay, isToday, subMonths } from 'date-fns';
import { useState } from 'react';
import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import { getCalendarMatrix } from './Calendar.helper';
import MonthlyCalendar from './monthly-calendar/MonthlyCalendar';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';

function Calendar() {
  const calendarView = useBoundStore((state) => state.calendarView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMatrix, setCalendarMatrix] = useState(getCalendarMatrix(currentDate));
  const [currentWeekOfMonth, setCurrentWeekOfMonth] = useState(() => {
    if (!isToday(currentDate)) return 0;
    return calendarMatrix.findIndex((dates) =>
      dates.some((date) => {
        if (!date) return false;
        return isSameDay(date, currentDate);
      }),
    );
  });

  const moveToPrevMonth = () => {
    const prevMonthDate = subMonths(currentDate, 1);
    setCurrentDate(prevMonthDate);
    const matrix = getCalendarMatrix(prevMonthDate);
    setCalendarMatrix(matrix);
    setCurrentWeekOfMonth(matrix.length - 1);
  };

  const moveToNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
    const matrix = getCalendarMatrix(nextMonthDate);
    setCalendarMatrix(matrix);
    setCurrentWeekOfMonth(0);
  };

  const moveToPrevWeek = () => {
    if (currentWeekOfMonth > 0) {
      setCurrentWeekOfMonth((prev) => prev - 1);
      return;
    }
    moveToPrevMonth();
  };

  const moveToNextWeek = () => {
    if (currentWeekOfMonth < calendarMatrix.length - 1) {
      setCurrentWeekOfMonth((prev) => prev + 1);
      return;
    }
    moveToNextMonth();
  };

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
