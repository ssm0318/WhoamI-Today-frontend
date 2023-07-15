import { isValid } from 'date-fns';

export const getValidDate = (dateString?: string): Date | undefined => {
  // TODO: dateString format 검사
  if (!dateString) return;
  const date = new Date(dateString);
  if (!isValid(date)) return;
  return date;
};
