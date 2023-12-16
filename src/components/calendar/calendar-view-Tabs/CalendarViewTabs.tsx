import Tabs from '@components/_common/tabs/Tabs';
import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';

const CALENDAR_VIEW_TAB_LIST = [
  { key: CALENDAR_VIEW.WEEKLY, text: 'W' },
  { key: CALENDAR_VIEW.MONTHLY, text: 'M' },
];

function CalendarViewTabs() {
  const { calendarView, setCalendarView, resetDetailDate } = useBoundStore((state) => ({
    calendarView: state.calendarView,
    setCalendarView: state.setCalendarView,
    resetDetailDate: state.resetDetailDate,
  }));

  const onClickTab = (view: CALENDAR_VIEW) => {
    setCalendarView(view);
    resetDetailDate();
  };

  return <Tabs tabList={CALENDAR_VIEW_TAB_LIST} onClick={onClickTab} selectedKey={calendarView} />;
}

export default CalendarViewTabs;
