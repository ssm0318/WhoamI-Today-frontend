export enum CALENDAR_VIEW {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

export type CalendarDates = (Date | null)[];
export type CalendarMatrix = CalendarDates[];

export interface CalendarProps {
  calendarMatrix: CalendarMatrix;
  currentDate: Date;
}
