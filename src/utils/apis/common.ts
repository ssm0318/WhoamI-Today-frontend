import { DateRequestParams } from '@models/api/common';

export const getDateRequestParams = (date: Date): DateRequestParams => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};
