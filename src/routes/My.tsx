import { useEffect } from 'react';
import Calendar from '@components/calendar/Calendar';
import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import MyDetail from '@components/my-detail/MyDetail';
import MyProfile from '@components/my-profile/MyProfile';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const { resetDetailDate, detailDate } = useBoundStore((state) => ({
    resetDetailDate: state.resetDetailDate,
    detailDate: state.detailDate,
  }));

  useEffect(() => {
    return () => resetDetailDate();
  }, [resetDetailDate]);

  return (
    <Layout.FlexCol w="100%" h="100vh" pt={20} bgColor="BACKGROUND_COLOR">
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" ph={24} pb={14}>
        <MyProfile />
        <CalendarViewTabs />
      </Layout.FlexRow>
      <Calendar />
      <MyDetail detailDate={detailDate} />
    </Layout.FlexCol>
  );
}

export default My;
