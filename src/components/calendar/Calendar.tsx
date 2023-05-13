import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import MonthlyCalendar from './monthly-calendar/MonthlyCalendar';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';

function Calendar() {
  const calendarView = useBoundStore((state) => state.calendarView);

  return calendarView === CALENDAR_VIEW.WEEKLY ? <WeeklyCalendar /> : <MonthlyCalendar />;
}

export default Calendar;
