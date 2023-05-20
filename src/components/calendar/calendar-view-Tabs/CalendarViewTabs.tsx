import { Font } from '@design-system';
import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import * as S from './CalendarViewTabs.styled';

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
    <S.CalendarViewTabs>
      {CALENDAR_VIEW_TAB_LIST.map(({ key, text }) => (
        <S.CalendarViewTab
          key={key}
          type="button"
          className={key === calendarView ? 'active' : ''}
          onClick={() => onClickTab(key)}
        >
          <Font.Display type="18_bold" textAlign="center">
            {text}
          </Font.Display>
        </S.CalendarViewTab>
      ))}
    </S.CalendarViewTabs>
  );
}

export default CalendarViewTabs;
