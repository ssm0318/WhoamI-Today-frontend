import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { useSurveyOfTheDay } from '@hooks/useSurveyOfTheDay';
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

const PrimaryButton = styled.button`
  align-self: flex-start;
  border: 1px solid ${Colors.PRIMARY};
  border-radius: 12px;
  padding: 8px 16px;
  background: ${Colors.PRIMARY};
  color: ${Colors.WHITE};
  font-size: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
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

const DRAFT_KEY_PREFIX = 'whoami_survey_draft_';

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const hasExistingDraft = (userId: number | null, slug: string): boolean => {
  try {
    const key = `${DRAFT_KEY_PREFIX}${userId ?? 'anon'}_${slug}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && parsed.answers && Object.keys(parsed.answers).length > 0;
  } catch {
    return false;
  }
};

function SurveyOfTheDay() {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const { data, isLoading } = useSurveyOfTheDay();
  const navigate = useNavigate();
  const userId = useBoundStore((s) => s.myProfile?.id ?? null);

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

  const hasDraft = hasExistingDraft(userId, survey.slug);
  const ctaLabel = hasDraft ? t('continue_survey') : t('start_survey');

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
      <Typo type="label-medium" color="DARK_GRAY">
        {t('question_total', { total: survey.questions.length })}
      </Typo>
      <PrimaryButton type="button" onClick={() => navigate(`/surveys/${survey.slug}/answer`)}>
        {ctaLabel}
      </PrimaryButton>
    </Card>
  );
}

export default SurveyOfTheDay;
