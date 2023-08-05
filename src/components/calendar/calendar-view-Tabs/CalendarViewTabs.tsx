import Tabs from '@components/_common/tabs/Tabs';
import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';

const CALENDAR_VIEW_TAB_LIST = [
  { key: CALENDAR_VIEW.WEEKLY, text: 'W' },
  { key: CALENDAR_VIEW.MONTHLY, text: 'M' },
];

function CalendarViewTabs() {
  const [calendarView, setCalendarView] = useBoundStore((state) => [
    state.calendarView,
    state.setCalendarView,
  ]);

  const onClickTab = (view: CALENDAR_VIEW) => {
    setCalendarView(view);
  };

  return (
    <Tabs
      tabList={CALENDAR_VIEW_TAB_LIST}
      displayFontType="18_bold"
      onClick={onClickTab}
      selectedKey={calendarView}
    />
  );
}

export default CalendarViewTabs;
