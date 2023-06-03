import { addDays, differenceInCalendarMonths, endOfMonth, startOfMonth } from 'date-fns';
import { DayMoment } from '@models/calendar';

export const getCalendarMonth = (currentDate: Date): DayMoment[] => {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  const dates: DayMoment[] = [];
  let curr = startDate;
  while (differenceInCalendarMonths(endDate, curr) >= 0) {
    dates.push({ date: curr });
    curr = addDays(curr, 1);
  }

  return dates;
};

type CalendarDates = (DayMoment | null)[];
type CalendarMatrix = CalendarDates[];

export const getCalendarMatrix = (calendarMonth: DayMoment[]): CalendarMatrix => {
  if (calendarMonth.length < 1) return [];
  const startDay = calendarMonth[0].date.getDay();
  const endDay = calendarMonth[calendarMonth.length - 1].date.getDay();
  const emptyDatesOfFirstWeek = new Array(startDay).fill(null);
  const emptyDatesOfLastWeek = new Array(6 - endDay).fill(null);

  const calendarDates: CalendarDates = [
    ...emptyDatesOfFirstWeek,
    ...calendarMonth,
    ...emptyDatesOfLastWeek,
  ];

  const calendarMatrix: CalendarMatrix = [];
  while (calendarDates.length) calendarMatrix.push(calendarDates.splice(0, 7));

  return calendarMatrix;
};
