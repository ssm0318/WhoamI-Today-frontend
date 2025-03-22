import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import { Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMe, getMyNotes, getMyResponses } from '@utils/apis/my';
import { MainScrollContainer } from './Root';

function My() {
  const { myProfile, fetchCheckIn } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    fetchCheckIn: state.fetchCheckIn,
  }));
  const [t] = useTranslation('translation', {
    keyPrefix: 'my',
  });
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  const handleClickNewNote = () => {
    return navigate('/notes/new');
  };

  const handleRefresh = useCallback(async () => {
    await Promise.all([getMyResponses(null), getMyNotes(null), fetchCheckIn(), getMe()]);
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
          <Layout.FlexRow ph={15} pv={10} bgColor="WHITE" w="100%" rounded="8px 8px 0px 0px">
            <Layout.FlexRow
              rounded={30}
              alignItems="center"
              w="100%"
              justifyContent="space-between"
              ph={20}
              pv={10}
              outline="LIGHT_GRAY"
              onClick={handleClickNewNote}
            >
              <Typo type="body-medium" color="DARK_GRAY">
                {t('whats_on_your_mind', { username: myProfile?.username })}
              </Typo>
              <Icon name="chat_media_image" size={24} fill="DARK_GRAY" />
            </Layout.FlexRow>
          </Layout.FlexRow>
          <Layout.FlexCol pl={12} pb="default" w="100%" bgColor="WHITE" rounded="0px 0px 8px 8px">
            <NoteSection />
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default My;
