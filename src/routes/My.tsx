import { useCallback } from 'react';
import { mutate } from 'swr';
import Divider from '@components/_common/divider/Divider';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteSection from '@components/note/note-section/NoteSection';
import AllPostSection from '@components/post/AllPostSection';
import Profile from '@components/profile/Profile';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from './Root';

function My() {
  const { myProfile, fetchCheckIn } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    fetchCheckIn: state.fetchCheckIn,
  }));

  const { featureFlags } = useBoundStore(UserSelector);

  const handleRefresh = useCallback(async () => {
    if (featureFlags?.questionResponseFeature) {
      await Promise.all([mutate('/user/me/all-posts/'), fetchCheckIn(), getMe()]);
    } else {
      await Promise.all([mutate('/user/me/notes/'), fetchCheckIn(), getMe()]);
    }
  }, [featureFlags?.questionResponseFeature, fetchCheckIn]);

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
          <Layout.FlexCol pl={12} pb="default" w="100%" bgColor="WHITE" rounded="0px 0px 8px 8px">
            {featureFlags?.questionResponseFeature ? <AllPostSection /> : <NoteSection />}
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default My;
