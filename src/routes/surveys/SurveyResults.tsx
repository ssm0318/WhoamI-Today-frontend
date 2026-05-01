import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { SurveyResultsBucket } from '@components/survey/SurveyResultsBucket';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { ResultPanel, Survey, SurveyResultsError } from '@models/survey';
import { getSurveyDetail, getSurveyResults } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  padding-top: ${TITLE_HEADER_HEIGHT + 16}px;
  gap: 24px;
  background: ${Colors.LIGHT};
  min-height: 100%;
`;

const DoneButton = styled.button`
  align-self: stretch;
  border: 1px solid ${Colors.PRIMARY};
  border-radius: 12px;
  padding: 12px 16px;
  background: ${Colors.PRIMARY};
  color: ${Colors.WHITE};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  -webkit-tap-highlight-color: transparent;
`;

const PanelGroup = styled(Layout.FlexCol)`
  width: 100%;
  gap: 12px;
`;

const PanelHeader = styled(Layout.FlexCol)`
  width: 100%;
  gap: 4px;
`;

const ActionButton = styled.button`
  align-self: flex-start;
  border: 1px solid ${Colors.PRIMARY};
  border-radius: 8px;
  padding: 8px 16px;
  background: ${Colors.PRIMARY};
  color: ${Colors.WHITE};
  font-size: 14px;
  cursor: pointer;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

interface AxiosError {
  response?: {
    status: number;
    data: SurveyResultsError;
  };
}

function panelHeading(panel: ResultPanel, t: (k: string) => string) {
  // Single-question panels carry the prompt as title; multi-question panels render
  // a kind label as the section heading.
  const localized = pickLocalized(panel.title_en, panel.title_ko);
  if (localized) return localized;
  return t(`panel_kinds.${panel.kind}`);
}

function PanelView({ panel, interpretation }: { panel: ResultPanel; interpretation?: string }) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  return (
    <PanelGroup>
      <PanelHeader>
        <Typo type="title-medium" color="BLACK">
          {panelHeading(panel, t)}
        </Typo>
        {panel.question_count > 1 && (
          <Typo type="label-medium" color="DARK_GRAY">
            {t('panel_questions_count', { count: panel.question_count })}
          </Typo>
        )}
      </PanelHeader>
      <SurveyResultsBucket
        title={t('buckets.population')}
        available={panel.population_available}
        reason={panel.population_suppressed_reason}
        bucket={panel.population}
        interpretation={interpretation}
      />
      <SurveyResultsBucket
        title={t('buckets.friends')}
        available={panel.friends_available}
        reason={panel.friends_suppressed_reason}
        bucket={panel.friends}
      />
      <SurveyResultsBucket
        title={t('buckets.close_friends')}
        available={panel.close_friends_available}
        reason={panel.close_friends_suppressed_reason}
        bucket={panel.close_friends}
      />
    </PanelGroup>
  );
}

function SurveyResults() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const navigate = useNavigate();

  const { data, error } = useSWR(
    slug ? `/surveys/${slug}/results/` : null,
    () => getSurveyResults(slug as string),
    { shouldRetryOnError: false },
  );
  const { data: survey } = useSWR<Survey>(slug ? `/surveys/${slug}/` : null, () =>
    getSurveyDetail(slug as string),
  );

  const axiosError = error as AxiosError | undefined;
  if (axiosError?.response?.status === 403) {
    const body = axiosError.response.data;
    return (
      <MainScrollContainer>
        <SubHeader title={t('locked_title')} />
        <Page>
          <Typo type="body-medium" color="DARK_GRAY">
            {body.detail}
          </Typo>
          {body.needs_submission && (
            <ActionButton type="button" onClick={() => navigate(`/surveys/${slug}/answer`)}>
              {t('answer_to_view_results')}
            </ActionButton>
          )}
          <DoneButton type="button" onClick={() => navigate('/share')}>
            {t('done')}
          </DoneButton>
        </Page>
      </MainScrollContainer>
    );
  }

  if (!data || !survey) return null;

  const interpretation = pickLocalized(survey.interpretation_en, survey.interpretation_ko);

  return (
    <MainScrollContainer>
      <SubHeader title={pickLocalized(survey.title_en, survey.title_ko)} />
      <Page>
        {data.panels.map((panel, idx) => (
          <PanelView
            key={panel.group_key}
            panel={panel}
            // Show the survey-level interpretation only on the first panel.
            interpretation={idx === 0 ? interpretation : undefined}
          />
        ))}
        <DoneButton type="button" onClick={() => navigate('/share')}>
          {t('done')}
        </DoneButton>
      </Page>
    </MainScrollContainer>
  );
}

export default SurveyResults;
