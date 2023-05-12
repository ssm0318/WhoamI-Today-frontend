import Calendar from '@components/calendar/Calendar';
import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import MyProfile from '@components/my-profile/MyProfile';
import { Layout } from '@design-system';

function My() {
  return (
    <Layout.FlexCol>
      <Layout.FlexRow>
        <MyProfile />
        <CalendarViewTabs />
      </Layout.FlexRow>
      <Layout.FlexCol>
        <Calendar />
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default My;
