import { useCallback } from 'react';
import Divider from '@components/_common/divider/Divider';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMyNotes, getMyResponses } from '@utils/apis/my';
import { MainScrollContainer } from './Root';

function My() {
  const { myProfile, fetchCheckIn } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    fetchCheckIn: state.fetchCheckIn,
  }));

  const { featureFlags } = useBoundStore(UserSelector);

  const handleRefresh = useCallback(async () => {
    await Promise.all([getMyResponses(null), getMyNotes(null), fetchCheckIn()]);
  }, [fetchCheckIn]);

  const { scrollRef } = useRestoreScrollPosition('myPage');

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20}>
          <Divider width={8} bgColor="LIGHT" />
          <Layout.FlexRow
            w="100%"
            alignItems="center"
            justifyContent="space-between"
            p={12}
            bgColor="WHITE"
            rounded={8}
          >
            <Profile user={myProfile} />
          </Layout.FlexRow>
          <Divider width={8} bgColor="LIGHT" />
          {featureFlags?.friendList && (
            <>
              <Layout.FlexCol pv={12} pl={12} w="100%" bgColor="WHITE" rounded={8}>
                <ResponseSection />
              </Layout.FlexCol>
              <Divider width={8} bgColor="LIGHT" />
            </>
          )}

          <Layout.FlexCol ph={12} pb="default" w="100%" bgColor="WHITE" rounded="0px 0px 8px 8px">
            <NoteSection />
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default My;
