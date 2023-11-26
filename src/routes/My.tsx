import { useEffect } from 'react';
import Divider from '@components/_common/divider/Divider';
import Calendar from '@components/calendar/Calendar';
import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import MyDetail from '@components/my-detail/MyDetail';
import Profile from '@components/profile/Profile';
import ReactionSection from '@components/reaction/reaction-section/ReactionSection';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const { resetDetailDate, detailDate } = useBoundStore((state) => ({
    resetDetailDate: state.resetDetailDate,
    detailDate: state.detailDate,
  }));

  useEffect(() => {
    return () => resetDetailDate();
  }, [resetDetailDate]);

  return (
    <Layout.FlexCol w="100%" bgColor="WHITE">
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        ph={DEFAULT_MARGIN}
        pv={12}
      >
        <Profile user={myProfile} />
      </Layout.FlexRow>
      <Divider width={1} />
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="flex-end"
        ph={DEFAULT_MARGIN}
        pv={12}
      >
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
