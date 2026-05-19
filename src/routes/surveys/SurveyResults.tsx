import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { SurveyResultsBucket } from '@components/survey/SurveyResultsBucket';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { ResultPanel, Survey, SurveyResultsError } from '@models/survey';
import { getSurveyDetail, getSurveyResults } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';
import { SurveyPageShell } from './SurveyPageLayout';

const Page = styled(SurveyPageShell)`
  gap: 28px;
`;

const PanelGroup = styled(Layout.FlexCol)`
  width: 100%;
  gap: 16px;
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
        audience="population"
      />
      <SurveyResultsBucket
        title={t('buckets.friends')}
        available={panel.friends_available}
        reason={panel.friends_suppressed_reason}
        bucket={panel.friends}
        audience="friends"
      />
      <SurveyResultsBucket
        title={t('buckets.close_friends')}
        available={panel.close_friends_available}
        reason={panel.close_friends_suppressed_reason}
        bucket={panel.close_friends}
        audience="close_friends"
      />
    </PanelGroup>
  );
}

function SurveyResults() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const navigate = useNavigate();
  const location = useLocation();

  const { data, error } = useSWR(
    slug ? `/surveys/${slug}/results/` : null,
    () => getSurveyResults(slug as string),
    { shouldRetryOnError: false },
  );
  const { data: survey } = useSWR<Survey>(slug ? `/surveys/${slug}/` : null, () =>
    getSurveyDetail(slug as string),
  );

  const headerTitle = survey ? pickLocalized(survey.title_en, survey.title_ko) : '';
  const headerRight = (
    <button type="button" onClick={() => navigate('/share')}>
      <Typo type="title-large" color="PRIMARY">
        {t('done')}
      </Typo>
    </button>
  );

  const axiosError = error as AxiosError | undefined;
  if (axiosError?.response?.status === 403) {
    const body = axiosError.response.data;
    return (
      <MainScrollContainer>
        <SubHeader title={headerTitle} RightComponent={headerRight} />
        <Page>
          <Typo type="title-large" color="BLACK">
            {body.detail}
          </Typo>
          {body.needs_submission && (
            <ActionButton
              type="button"
              onClick={() =>
                // Pass `from` so the post-submit Done page returns the
                // user to the results page instead of the global index
                // (the user is mid-flow on this slug).
                navigate(`/surveys/${slug}/answer`, {
                  state: { from: location.pathname + location.search },
                })
              }
            >
              {t('answer_to_view_results')}
            </ActionButton>
          )}
        </Page>
      </MainScrollContainer>
    );
  }

  if (!data || !survey) return null;

  const interpretation = pickLocalized(survey.interpretation_en, survey.interpretation_ko);

  return (
    <MainScrollContainer>
      <SubHeader title={headerTitle} RightComponent={headerRight} />
      <Page>
        {data.panels.map((panel, idx) => (
          <PanelView
            key={panel.group_key}
            panel={panel}
            // Show the survey-level interpretation only on the first panel.
            interpretation={idx === 0 ? interpretation : undefined}
          />
        ))}
      </Page>
    </MainScrollContainer>
  );
}

export default SurveyResults;
