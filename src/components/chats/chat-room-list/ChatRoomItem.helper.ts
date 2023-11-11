import { differenceInCalendarDays, differenceInCalendarYears, format } from 'date-fns';

export const formatLastMessageTime = (dayString: string) => {
  const now = new Date();
  const day = new Date(dayString);

  const diffDays = differenceInCalendarDays(now, day);
  const diffYears = differenceInCalendarYears(now, day);

  if (diffDays < 1) {
    return format(new Date(day), 'h:mm aaa');
  }

  if (diffYears < 1) {
    return format(new Date(day), 'MMM dd');
  }

  return format(new Date(day), 'y. M. d.');
};
