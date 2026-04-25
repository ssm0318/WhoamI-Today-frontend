import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { useShallow } from 'zustand/react/shallow';
import Divider from '@components/_common/divider/Divider';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteSection from '@components/note/note-section/NoteSection';
import AllPostSection from '@components/post/AllPostSection';
import Profile from '@components/profile/Profile';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMe, getMyProfile } from '@utils/apis/my';
import { MainScrollContainer } from './Root';

function My() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const { myProfile, fetchCheckIn } = useBoundStore(
    useShallow((state) => ({
      myProfile: state.myProfile,
      fetchCheckIn: state.fetchCheckIn,
    })),
  );

  const { featureFlags } = useBoundStore(useShallow(UserSelector));

  // Load pinned_cnt on mount
  useEffect(() => {
    getMyProfile();
  }, []);

  const handleRefresh = useCallback(async () => {
    if (featureFlags?.questionResponseFeature) {
      await Promise.all([mutate('/user/me/all-posts/'), fetchCheckIn(), getMe(), getMyProfile()]);
    } else {
      await Promise.all([mutate('/user/me/notes/'), fetchCheckIn(), getMe(), getMyProfile()]);
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
          {featureFlags?.postsVerQ && (
            <Layout.FlexRow
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              p={12}
              bgColor="WHITE"
              onClick={() => navigate('/my/friends/list')}
              style={{ cursor: 'pointer', borderTop: '1px solid #EEE' }}
            >
              <Typo type="title-medium" color="BLACK">
                {t('nav_tab.friends')}
              </Typo>
              <Layout.FlexRow alignItems="center" gap={4}>
                <Typo type="label-medium" color="DARK_GRAY">
                  {myProfile?.friend_count ?? 0}
                </Typo>
                <SvgIcon name="arrow_right" size={16} fill="DARK_GRAY" />
              </Layout.FlexRow>
            </Layout.FlexRow>
          )}
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
