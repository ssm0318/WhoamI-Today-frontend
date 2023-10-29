import { useEffect } from 'react';
import Divider from '@components/_common/divider/Divider';
import Calendar from '@components/calendar/Calendar';
import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import MyDetail from '@components/my-detail/MyDetail';
import MyProfile from '@components/my-profile/MyProfile';
import ReactionSection from '@components/reaction/reaction-section/ReactionSection';
import MyStatus from '@components/status/my-status/MyStatus';
import { DEFAULT_MARGIN } from '@constants/layout';
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
    <Layout.FlexCol w="100%" h="100vh" bgColor="BASIC_WHITE">
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        ph={DEFAULT_MARGIN}
        pv={12}
      >
        <MyStatus />
      </Layout.FlexRow>
      <Divider width={1} />
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        ph={DEFAULT_MARGIN}
        pv={12}
      >
        <MyProfile />
        <CalendarViewTabs />
      </Layout.FlexRow>
      <Calendar />
      <MyDetail detailDate={detailDate} />
      <ReactionSection emojis={['💪🏻', '😊', '😋']} />
      <Divider width={500} />
      <ReactionSection emojis={['💡', '🙇‍♀️', '🤾', '🤪', '🤯', '🥺']} />
    </Layout.FlexCol>
  );
}

export default My;
