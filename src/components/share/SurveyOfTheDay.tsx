import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Typo } from '@design-system';
import { useSurveyOfTheDay } from '@hooks/useSurveyOfTheDay';
import i18n from '@i18n/index';
import { useBoundStore } from '@stores/useBoundStore';

const SURVEY_GRADIENT = 'linear-gradient(135deg, #0072EC 0%, #003E99 100%)';

const ColorCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background: ${SURVEY_GRADIENT};
  text-align: left;
`;

const ActionButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
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
  const location = useLocation();
  const userId = useBoundStore((s) => s.myProfile?.id ?? null);

  if (isLoading) return null;
  const survey = data?.survey;
  if (!survey) return null;

  const sectionTitle = (
    <Typo type="head-line" color="WHITE" bold>
      {t('section_title')}
    </Typo>
  );
  const surveyTitle = (
    <Typo type="title-medium" color="WHITE">
      {pickLocalized(survey.title_en, survey.title_ko)}
    </Typo>
  );

  if (survey.user_has_responded) {
    return (
      <ColorCard>
        {sectionTitle}
        {surveyTitle}
        <Typo type="title-medium" color="WHITE">
          {t('thanks_results_tomorrow')}
        </Typo>
        <ActionButton onClick={() => navigate(`/surveys/${survey.slug}/results`)}>
          <Typo type="label-large" fontWeight={600}>
            {t('view_results')}
          </Typo>
        </ActionButton>
      </ColorCard>
    );
  }

  const hasDraft = hasExistingDraft(userId, survey.slug);
  const ctaLabel = hasDraft ? t('continue_survey') : t('start_survey');

  return (
    <ColorCard>
      {sectionTitle}
      {surveyTitle}
      <Typo type="label-medium" color="WHITE">
        {survey.responder_count > 0
          ? t('responder_count_today', { count: survey.responder_count })
          : t('responder_count_today_zero')}
      </Typo>
      <ActionButton
        onClick={() =>
          // Pass `from` so the post-submit Done page can return the
          // user here (the Share tab) instead of the surveys index.
          navigate(`/surveys/${survey.slug}/answer`, {
            state: { from: location.pathname + location.search },
          })
        }
      >
        <Typo type="label-large" fontWeight={600}>
          {ctaLabel}
        </Typo>
      </ActionButton>
    </ColorCard>
  );
}

export default SurveyOfTheDay;
