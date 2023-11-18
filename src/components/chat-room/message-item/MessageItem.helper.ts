import { format } from 'date-fns';

export const getTime = (date: string) => {
  return `${format(new Date(date), 'h:mmaaaaa')}m`;
};
