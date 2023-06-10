import { addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';
import { CALENDAR_VIEW } from '@models/calendar';
import { SliceStateCreator } from '@stores/useBoundStore';

interface MyPageState {
  calendarView: CALENDAR_VIEW;
  myPageCurrDate: Date;
}

interface MyPageAction {
  setCalendarView: (calendarView: CALENDAR_VIEW) => void;
  setMyPageCurrDate: (date: Date) => void;
  subWeekFromCurrDate: () => void;
  addWeekFromCurrDate: () => void;
  subMonthFromCurrDate: () => void;
  addMonthFromCurrDate: () => void;
}

const initialState = {
  calendarView: CALENDAR_VIEW.WEEKLY,
  myPageCurrDate: new Date(),
};

export type MyPageSlice = MyPageState & MyPageAction;

export const createMyPageSlice: SliceStateCreator<MyPageSlice> = (set) => ({
  ...initialState,
  setCalendarView: (calendarView: CALENDAR_VIEW) =>
    set(() => ({ calendarView }), false, 'myPage/setCalendarView'),
  setMyPageCurrDate: (date: Date) =>
    set(() => ({ myPageCurrDate: date }), false, 'myPage/setMyPageCurrDate'),
  subWeekFromCurrDate: () =>
    set(
      ({ myPageCurrDate: prevCurrDate }) => ({ myPageCurrDate: subWeeks(prevCurrDate, 1) }),
      false,
      'myPage/subWeekFromCurrDate',
    ),
  addWeekFromCurrDate: () =>
    set(
      ({ myPageCurrDate: prevCurrDate }) => ({ myPageCurrDate: addWeeks(prevCurrDate, 1) }),
      false,
      'myPage/addWeekFromCurrDate',
    ),
  subMonthFromCurrDate: () =>
    set(
      ({ myPageCurrDate: prevCurrDate }) => ({ myPageCurrDate: subMonths(prevCurrDate, 1) }),
      false,
      'myPage/subMonthFromCurrDate',
    ),
  addMonthFromCurrDate: () =>
    set(
      ({ myPageCurrDate: prevCurrDate }) => ({ myPageCurrDate: addMonths(prevCurrDate, 1) }),
      false,
      'myPage/addMonthFromCurrDate',
    ),
});
