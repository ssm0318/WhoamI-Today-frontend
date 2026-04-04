import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import PromptCard from '@components/_common/prompt/PromptCard';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import MissionOfTheDay from '@components/share/MissionOfTheDay';
import ThoughtSnippetInput from '@components/share/ThoughtSnippetInput';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { DailyQuestion, PostVisibility, ShareType } from '@models/post';
import { getMe } from '@utils/apis/my';
import { postNote } from '@utils/apis/note';
import { getTodayQuestions } from '@utils/apis/question';
import { getTmiPlaceholder } from '@utils/apis/tmi';
import { MainScrollContainer } from '../Root';
import {
  PhotoOfTheDayCard,
  SharePhotoButton,
  TmiInputBar,
  TmiInputBarWrapper,
} from './Share.styled';

type ShareTab = 'snippets' | 'photo' | 'mission';

function Share() {
  const [t, i18n] = useTranslation('translation');
  const navigate = useNavigate();
  const { scrollRef } = useRestoreScrollPosition('sharePage');
  const [activeTab, setActiveTab] = useState<ShareTab>('snippets');
  const [isSnippetInputVisible, setIsSnippetInputVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: todayQuestions, mutate } = useSWR<DailyQuestion[]>(
    '/qna/questions/daily/',
    getTodayQuestions,
  );

  const { data: tmiPlaceholder } = useSWR(`/user/tmi-placeholder/?lang=${i18n.language}`, () =>
    getTmiPlaceholder(i18n.language),
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([mutate(), getMe()]);
  }, [mutate]);

  const handleClickTmiInput = () => {
    setIsSnippetInputVisible(true);
  };

  const handleSnippetSubmit = async (content: string) => {
    try {
      await postNote({
        content,
        share_type: ShareType.TMI_OF_THE_DAY,
        visibility: [PostVisibility.FRIENDS],
      });
    } catch {
      // Error handled by toast
    }
  };

  const handleClickSharePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    navigate('/notes/new', {
      state: { shareType: ShareType.PHOTO_OF_THE_DAY },
    });
  };

  const handleDoMission = (mission: { prompt: string; type: string }) => {
    if (mission.type === 'song') {
      navigate('/check-in/edit?focus=song');
    } else {
      setIsSnippetInputVisible(true);
    }
  };

  const TABS: { key: ShareTab; label: string }[] = [
    { key: 'snippets', label: 'Thought Snippets' },
    { key: 'photo', label: 'Photo' },
    { key: 'mission', label: 'Mission' },
  ];

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%">
          {/* Tab bar */}
          <Layout.FlexRow
            w="100%"
            justifyContent="space-evenly"
            style={{
              borderBottom: '1px solid #E0E0E0',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10,
            }}
          >
            {TABS.map((tab) => (
              <Layout.FlexCol
                key={tab.key}
                alignItems="center"
                pv={12}
                ph={8}
                style={{
                  cursor: 'pointer',
                  borderBottom:
                    activeTab === tab.key ? '2px solid #8700FF' : '2px solid transparent',
                  flex: 1,
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                <Typo
                  type="label-large"
                  color={activeTab === tab.key ? 'PRIMARY' : 'MEDIUM_GRAY'}
                  fontWeight={activeTab === tab.key ? 600 : 400}
                  textAlign="center"
                >
                  {tab.label}
                </Typo>
              </Layout.FlexCol>
            ))}
          </Layout.FlexRow>

          {/* Tab content */}
          {activeTab === 'snippets' && (
            <Layout.FlexCol w="100%">
              <TmiInputBarWrapper>
                <Typo type="head-line" color="WHITE" bold>
                  Thought Snippets
                </Typo>
                <TmiInputBar type="button" onClick={handleClickTmiInput}>
                  <Layout.FlexRow gap={8} alignItems="center" style={{ flex: 1, minWidth: 0 }}>
                    <SvgIcon name="add_default" size={24} color="PRIMARY" />
                    <Typo type="body-medium" color="MEDIUM_GRAY" ellipsis={{ enabled: true }}>
                      {tmiPlaceholder || t('share_page.tmi_placeholder')}
                    </Typo>
                  </Layout.FlexRow>
                </TmiInputBar>
              </TmiInputBarWrapper>

              <Layout.FlexCol pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20} pb={100}>
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
          )}

          {activeTab === 'photo' && (
            <Layout.FlexCol pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20} pb={100}>
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
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png"
                onChange={handlePhotoSelected}
                style={{ display: 'none' }}
              />
            </Layout.FlexCol>
          )}

          {activeTab === 'mission' && (
            <Layout.FlexCol pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20} pb={100}>
              <MissionOfTheDay onDoMission={handleDoMission} />
            </Layout.FlexCol>
          )}
        </Layout.FlexCol>
      </PullToRefresh>

      <ThoughtSnippetInput
        visible={isSnippetInputVisible}
        onClose={() => setIsSnippetInputVisible(false)}
        onSubmit={handleSnippetSubmit}
      />
    </MainScrollContainer>
  );
}

export default Share;
