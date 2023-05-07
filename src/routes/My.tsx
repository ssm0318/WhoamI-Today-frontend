import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import MonthlyCalendar from '@components/calendar/monthly-calendar/MonthlyCalendar';
import WeeklyCalendar from '@components/calendar/weekly-calendar/WeeklyCalendar';
import MyProfile from '@components/my-profile/MyProfile';
import { Layout } from '@design-system';
import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const calendarView = useBoundStore((state) => state.calendarView);

  return (
    <Layout.FlexCol>
      <Layout.FlexRow>
        <MyProfile />
        <CalendarViewTabs />
      </Layout.FlexRow>
      {calendarView === CALENDAR_VIEW.MONTHLY ? <MonthlyCalendar /> : <WeeklyCalendar />}
    </Layout.FlexCol>
  );
}

export default My;
