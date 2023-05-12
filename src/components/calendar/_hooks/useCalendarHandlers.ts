import { addMonths, isSameDay, isToday, subMonths } from 'date-fns';
import { useCallback, useState } from 'react';
import { getCalendarMatrix } from '../_helpers/getCalendarMatrix';

export function useCalendarHandlers() {
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

  const moveToPrevMonth = useCallback(() => {
    const prevMonthDate = subMonths(currentDate, 1);
    setCurrentDate(prevMonthDate);
    const matrix = getCalendarMatrix(prevMonthDate);
    setCalendarMatrix(matrix);
    setCurrentWeekOfMonth(matrix.length - 1);
  }, [currentDate]);

  const moveToNextMonth = useCallback(() => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
    const matrix = getCalendarMatrix(nextMonthDate);
    setCalendarMatrix(matrix);
    setCurrentWeekOfMonth(0);
  }, [currentDate]);

  const moveToPrevWeek = useCallback(() => {
    if (currentWeekOfMonth > 0) {
      setCurrentWeekOfMonth((prev) => prev - 1);
      return;
    }
    moveToPrevMonth();
  }, [currentWeekOfMonth, moveToPrevMonth]);

  const moveToNextWeek = useCallback(() => {
    if (currentWeekOfMonth < calendarMatrix.length - 1) {
      setCurrentWeekOfMonth((prev) => prev + 1);
      return;
    }
    moveToNextMonth();
  }, [calendarMatrix.length, currentWeekOfMonth, moveToNextMonth]);

  return {
    currentDate,
    currentWeekOfMonth,
    calendarMatrix,
    moveToPrevMonth,
    moveToNextMonth,
    moveToPrevWeek,
    moveToNextWeek,
  };
}
