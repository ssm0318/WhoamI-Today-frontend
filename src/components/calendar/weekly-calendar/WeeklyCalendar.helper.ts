import { addDays, differenceInCalendarWeeks, endOfWeek, startOfWeek } from 'date-fns';
import { DayMoment } from '@models/calendar';

export const getCalendarWeek = (currentDate: Date): DayMoment[] => {
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  const dates: DayMoment[] = [];

  let curr = startDate;
  while (differenceInCalendarWeeks(endDate, curr) >= 0) {
    dates.push({ date: curr });
    curr = addDays(curr, 1);
  }

  return dates;
};
