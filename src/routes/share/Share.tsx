import { ChangeEvent, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import CheckInPostShareCta from '@components/share/CheckInPostShareCta';
import MissionOfTheDay, { markMissionCompleted } from '@components/share/MissionOfTheDay';
import NotePostInputTrigger from '@components/share/NotePostInputTrigger';
import QuestionsOfTheDaySection from '@components/share/QuestionsOfTheDaySection';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { DailyQuestion } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMe } from '@utils/apis/my';
import { getTodayQuestions } from '@utils/apis/question';
import { MainScrollContainer } from '../Root';
import { ColorCard, ShareActionButton } from './Share.styled';

function Share() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const { scrollRef } = useRestoreScrollPosition('sharePage');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { featureFlags } = useBoundStore(UserSelector);

  const { mutate } = useSWR<DailyQuestion[]>('/qna/questions/daily/', getTodayQuestions);

  const handleRefresh = useCallback(async () => {
    await Promise.all([mutate(), getMe()]);
  }, [mutate]);

  if (featureFlags?.shareTabVisible && featureFlags?.postsVerQ) {
    return (
      <MainScrollContainer scrollRef={scrollRef}>
        <PullToRefresh onRefresh={handleRefresh}>
          <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={16} gap={16} pb={100}>
            <NotePostInputTrigger />
            <CheckInPostShareCta />
            <QuestionsOfTheDaySection />
          </Layout.FlexCol>
        </PullToRefresh>
      </MainScrollContainer>
    );
  }

  const handleClickSharePhoto = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      navigate('/share/photo', { state: { imageDataUrl: reader.result as string } });
    };
    reader.readAsDataURL(file);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleDoMission = (mission: { prompt: string; type: string }) => {
    if (mission.type === 'song') {
      markMissionCompleted();
      navigate('/update');
    } else {
      navigate('/notes/new', {
        state: { tmiPlaceholder: mission.prompt, fromShare: true, missionMode: true },
      });
    }
  };

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={16} gap={16} pb={100}>
          {/* Section 1: Photo of the Day */}
          <ColorCard $bg="linear-gradient(135deg, #FF00A8 0%, #C2007E 100%)">
            <Typo type="head-line" color="WHITE" bold>
              Photo of the Day
            </Typo>
            <Typo type="title-medium" color="WHITE">
              {t('share_page.photo_description')}
            </Typo>
            <ShareActionButton onClick={handleClickSharePhoto}>
              <Typo type="label-large" fontWeight={600}>
                Share photo
              </Typo>
            </ShareActionButton>
          </ColorCard>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={handlePhotoFileSelected}
            style={{ display: 'none' }}
          />

          {/* Section 2: Mission of the Day */}
          <ColorCard $bg="linear-gradient(135deg, #8700FF 0%, #6200B3 100%)">
            <Typo type="head-line" color="WHITE" bold>
              Mission of the Day
            </Typo>
            <MissionOfTheDay onDoMission={handleDoMission} />
          </ColorCard>

          {/* Section 3: Questions of the Day */}
          <QuestionsOfTheDaySection />
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Share;
