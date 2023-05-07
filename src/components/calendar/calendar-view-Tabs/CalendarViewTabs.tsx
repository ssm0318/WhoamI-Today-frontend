import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';

const CALENDAR_VIEW_TAB_LIST = [
  { key: CALENDAR_VIEW.MONTHLY, text: 'M' },
  { key: CALENDAR_VIEW.WEEKLY, text: 'W' },
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
    <div>
      {CALENDAR_VIEW_TAB_LIST.map(({ key, text }) => (
        <button
          key={key}
          type="button"
          className={`${calendarView === key ? 'active' : ''}`}
          onClick={() => onClickTab(key)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default CalendarViewTabs;
