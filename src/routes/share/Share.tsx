import { ChangeEvent, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import PromptCard from '@components/_common/prompt/PromptCard';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import MissionOfTheDay from '@components/share/MissionOfTheDay';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Button, Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { DailyQuestion } from '@models/post';
import { getMe } from '@utils/apis/my';
import { getTodayQuestions } from '@utils/apis/question';
import { MainScrollContainer } from '../Root';
import { PhotoOfTheDayCard, SectionCard, SharePhotoButton } from './Share.styled';

const MAX_VISIBLE_QUESTIONS = 3;

function Share() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const { scrollRef } = useRestoreScrollPosition('sharePage');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { data: todayQuestions, mutate } = useSWR<DailyQuestion[]>(
    '/qna/questions/daily/',
    getTodayQuestions,
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([mutate(), getMe()]);
  }, [mutate]);

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
      navigate('/update');
    } else {
      navigate('/notes/new', {
        state: { tmiPlaceholder: mission.prompt },
      });
    }
  };

  const visibleQuestions = todayQuestions?.slice(0, MAX_VISIBLE_QUESTIONS) ?? [];

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={16} gap={16} pb={100}>
          {/* Section 1: Photo of the Day */}
          <PhotoOfTheDayCard type="button" onClick={handleClickSharePhoto}>
            <Typo type="head-line" color="WHITE" bold>
              {t('share_page.photo_of_the_day')}
            </Typo>
            <Typo type="body-medium" color="WHITE">
              {t('share_page.photo_description')}
            </Typo>
            <SharePhotoButton>
              <Typo type="body-large" color="WHITE">
                {t('share_page.share_photo')}
              </Typo>
            </SharePhotoButton>
          </PhotoOfTheDayCard>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={handlePhotoFileSelected}
            style={{ display: 'none' }}
          />

          {/* Section 2: Mission of the Day */}
          <SectionCard>
            <MissionOfTheDay onDoMission={handleDoMission} />
          </SectionCard>

          {/* Section 3: Questions of the Day */}
          <SectionCard>
            <Typo type="title-medium" mb={12}>
              Questions of the Day
            </Typo>
            {visibleQuestions.length > 0 ? (
              <Layout.FlexCol w="100%" gap={10}>
                {visibleQuestions.map((question) => (
                  <PromptCard
                    key={question.id}
                    id={question.id}
                    content={question.content}
                    widthMode="full"
                    authorDetail={question.author_detail}
                  />
                ))}
              </Layout.FlexCol>
            ) : (
              <Typo type="body-medium" color="MEDIUM_GRAY">
                {t('no_contents.question')}
              </Typo>
            )}
            {todayQuestions && todayQuestions.length > MAX_VISIBLE_QUESTIONS && (
              <Layout.FlexRow w="100%" justifyContent="center" mt={12}>
                <Button.Tertiary
                  text="See all questions"
                  status="normal"
                  onClick={() => navigate('/questions')}
                />
              </Layout.FlexRow>
            )}
          </SectionCard>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Share;
