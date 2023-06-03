import { isSameDay } from 'date-fns';
import { GetMomentResponse } from '@models/api/moment';
import { DayMoment } from '@models/calendar';

export const mapMomentToCalendar = (calendar: DayMoment[], moments: GetMomentResponse[]) =>
  calendar.map((dayMoment) => ({
    ...dayMoment,
    moment: moments.find((moment) => isSameDay(new Date(moment.date), dayMoment.date)),
  }));
