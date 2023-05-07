import { CALENDAR_VIEW } from '@models/calendar';
import { SliceStateCreator } from '@stores/useBoundStore';

interface CalendarViewState {
  calendarView: CALENDAR_VIEW;
}

interface CalendarViewAction {
  setCalendarView: (calendarView: CALENDAR_VIEW) => void;
}

const initialState = {
  calendarView: CALENDAR_VIEW.MONTHLY,
};

export type CalendarViewSlice = CalendarViewState & CalendarViewAction;

export const createCalendarViewSlice: SliceStateCreator<CalendarViewSlice> = (set) => ({
  ...initialState,
  setCalendarView: (calendarView: CALENDAR_VIEW) => set(() => ({ calendarView })),
});
