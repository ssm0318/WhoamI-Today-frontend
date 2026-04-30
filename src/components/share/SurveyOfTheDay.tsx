import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mutate } from 'swr';

import { SurveyAnswerForm } from '@components/survey/SurveyAnswerForm';
import { Colors, Layout, Typo } from '@design-system';
import { SURVEY_OF_THE_DAY_KEY, useSurveyOfTheDay } from '@hooks/useSurveyOfTheDay';
import i18n from '@i18n/index';
import { useBoundStore } from '@stores/useBoundStore';

const Card = styled(Layout.FlexCol)`
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 16px;
  gap: 12px;
  width: 100%;
`;

const ResultsLink = styled.button`
  align-self: flex-start;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  background: ${Colors.WHITE};
  color: ${Colors.PRIMARY};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

function SurveyOfTheDay() {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const { data, isLoading } = useSurveyOfTheDay();
  const navigate = useNavigate();
  const openToast = useBoundStore((s) => s.openToast);

  if (isLoading) return null;
  const survey = data?.survey;
  if (!survey) return null;

  if (survey.user_has_responded) {
    return (
      <Card>
        <Typo type="title-medium" color="BLACK">
          {pickLocalized(survey.title_en, survey.title_ko)}
        </Typo>
        <Typo type="body-medium" color="DARK_GRAY">
          {t('thanks_results_tomorrow')}
        </Typo>
        <ResultsLink type="button" onClick={() => navigate(`/surveys/${survey.slug}/results`)}>
          {t('view_results')}
        </ResultsLink>
      </Card>
    );
  }

  return (
    <Card>
      <Typo type="title-medium" color="BLACK">
        {pickLocalized(survey.title_en, survey.title_ko)}
      </Typo>
      {survey.description_en && (
        <Typo type="body-medium" color="DARK_GRAY">
          {pickLocalized(survey.description_en, survey.description_ko)}
        </Typo>
      )}
      <SurveyAnswerForm
        survey={survey}
        onSubmitted={() => {
          mutate(SURVEY_OF_THE_DAY_KEY);
          openToast({ message: t('toast.submitted') });
        }}
        onError={(message) => openToast({ message })}
      />
    </Card>
  );
}

export default SurveyOfTheDay;
