import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import PromptCard from '@components/_common/prompt/PromptCard';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { DailyQuestion, ShareType } from '@models/post';
import { getMe } from '@utils/apis/my';
import { getTodayQuestions } from '@utils/apis/question';

import { MainScrollContainer } from '../Root';
import {
  PhotoOfTheDayCard,
  SharePhotoButton,
  TmiInputBar,
  TmiInputBarWrapper,
} from './Share.styled';

function Share() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const { scrollRef } = useRestoreScrollPosition('sharePage');

  const { data: todayQuestions, mutate } = useSWR<DailyQuestion[]>(
    '/qna/questions/daily/',
    getTodayQuestions,
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([mutate(), getMe()]);
  }, [mutate]);

  const handleClickTmiInput = () => {
    navigate('/notes/new', {
      state: { shareType: ShareType.TMI_OF_THE_DAY },
    });
  };

  const handleClickSharePhoto = () => {
    navigate('/notes/new', {
      state: { shareType: ShareType.PHOTO_OF_THE_DAY },
    });
  };

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          {/* TMI Input Bar */}
          <TmiInputBarWrapper>
            <TmiInputBar type="button" onClick={handleClickTmiInput}>
              <Layout.FlexRow gap={8} alignItems="center">
                <SvgIcon name="add_default" size={24} color="PRIMARY" />
                <Typo type="body-medium" color="DARK_GRAY">
                  {t('share_page.tmi_placeholder')}
                </Typo>
              </Layout.FlexRow>
              <SvgIcon name="chat_media_image" size={24} fill="DARK_GRAY" />
            </TmiInputBar>
          </TmiInputBarWrapper>

          <Layout.FlexCol pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20} pb={100}>
            {/* Photo of the Day Card */}
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

            {/* Questions of the Day */}
            <Layout.FlexCol w="100%" gap={10}>
              <Typo type="body-large" color="BLACK" bold>
                {t('share_page.questions_of_the_day')}
              </Typo>
              {todayQuestions && todayQuestions.length > 0 ? (
                todayQuestions.map((question) => (
                  <PromptCard
                    key={question.id}
                    id={question.id}
                    content={question.content}
                    widthMode="full"
                    authorDetail={question.author_detail}
                  />
                ))
              ) : (
                <Typo type="body-medium" color="MEDIUM_GRAY">
                  {t('no_contents.question')}
                </Typo>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Share;
