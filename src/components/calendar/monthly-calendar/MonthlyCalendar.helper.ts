import { addDays, differenceInCalendarMonths, endOfMonth, startOfMonth } from 'date-fns';

export const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const getCalendarMatrix = (currentDate: Date): (Date | null)[][] => {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const dayOfStartDate = startDate.getDay();
  const dayOfEndDate = endDate.getDay();
  const emptyDatesOfFirstWeek = new Array(dayOfStartDate).fill(null);
  const emptyDatesOfLastWeek = new Array(6 - dayOfEndDate).fill(null);

  const dates: Date[] = [];
  let curr = startDate;
  while (differenceInCalendarMonths(endDate, curr) >= 0) {
    dates.push(curr);
    curr = addDays(curr, 1);
  }
  const calendarDates: (Date | null)[] = [
    ...emptyDatesOfFirstWeek,
    ...dates,
    ...emptyDatesOfLastWeek,
  ];

  const calendarMatrix: (Date | null)[][] = [];
  while (calendarDates.length) calendarMatrix.push(calendarDates.splice(0, 7));

  return calendarMatrix;
};
