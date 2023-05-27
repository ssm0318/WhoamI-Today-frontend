import { addDays, differenceInCalendarWeeks, endOfWeek, startOfWeek } from 'date-fns';

export const getCalendarWeek = (currentDate: Date) => {
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  const dates: Date[] = [];
  let curr = startDate;
  while (differenceInCalendarWeeks(endDate, curr) >= 0) {
    dates.push(curr);
    curr = addDays(curr, 1);
  }

  return dates;
};
