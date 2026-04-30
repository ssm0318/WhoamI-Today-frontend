import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import { SurveyResultsBucket } from '@components/survey/SurveyResultsBucket';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { Survey, SurveyResultsError } from '@models/survey';
import { getSurveyDetail, getSurveyResults } from '@utils/apis/survey';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  gap: 16px;
  background: ${Colors.LIGHT};
  min-height: 100vh;
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
      <Page>
        <Typo type="title-large" color="BLACK">
          {t('locked_title')}
        </Typo>
        <Typo type="body-medium" color="DARK_GRAY">
          {body.detail}
        </Typo>
        {body.needs_submission && (
          <ActionButton type="button" onClick={() => navigate(`/surveys/${slug}/answer`)}>
            {t('answer_to_view_results')}
          </ActionButton>
        )}
      </Page>
    );
  }

  if (!data || !survey) return null;

  const interpretation = pickLocalized(survey.interpretation_en, survey.interpretation_ko);

  return (
    <Page>
      <Typo type="title-large" color="BLACK">
        {pickLocalized(survey.title_en, survey.title_ko)}
      </Typo>
      <SurveyResultsBucket
        title={t('buckets.population')}
        available={data.population_available}
        reason={data.population_suppressed_reason}
        bucket={data.population}
        interpretation={interpretation}
      />
      <SurveyResultsBucket
        title={t('buckets.friends')}
        available={data.friends_available}
        reason={data.friends_suppressed_reason}
        bucket={data.friends}
      />
      <SurveyResultsBucket
        title={t('buckets.close_friends')}
        available={data.close_friends_available}
        reason={data.close_friends_suppressed_reason}
        bucket={data.close_friends}
      />
    </Page>
  );
}

export default SurveyResults;
