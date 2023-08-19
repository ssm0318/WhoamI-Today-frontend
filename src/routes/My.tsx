import Calendar from '@components/calendar/Calendar';
import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import MyProfile from '@components/my-profile/MyProfile';
import { Layout } from '@design-system';

function My() {
  return (
    <Layout.FlexCol w="100%" h="100%" pt={20} bgColor="BACKGROUND_COLOR">
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" ph={24} pb={14}>
        <MyProfile />
        <CalendarViewTabs />
      </Layout.FlexRow>
      <Calendar />
    </Layout.FlexCol>
  );
}

export default My;
