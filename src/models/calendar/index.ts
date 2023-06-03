import { GetMomentResponse } from '@models/api/moment';

export enum CALENDAR_VIEW {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

export interface DayMoment {
  date: Date;
  moment?: GetMomentResponse;
}
