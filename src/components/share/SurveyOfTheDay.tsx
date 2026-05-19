import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import LockedBadgeModal from '@components/survey/LockedBadgeModal';
import PointsBadge from '@components/survey/PointsBadge';
import {
  isSurveysPaused,
  SURVEYS_PAUSED_MESSAGE_EN,
  SURVEYS_PAUSED_MESSAGE_KO,
} from '@constants/surveyPause';
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

const ActionButton = styled.div<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 0.8)};
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  if (isLoading) return null;

  const sectionTitle = (
    <Typo type="head-line" color="WHITE" bold>
      {t('section_title')}
    </Typo>
  );

  // Temporary maintenance gate — render the card even when the backend
  // hasn't returned a survey for today (e.g. because the prereq-token gate
  // is hiding the broken survey-of-the-day). The whole point of the paused
  // card is to keep the SOTD slot visible so participants don't assume
  // there's nothing to do; that breaks if we depend on the API returning
  // a survey to render anything at all. Auto-lifts once
  // SURVEYS_PAUSED_UNTIL passes — no second deploy needed.
  if (isSurveysPaused()) {
    return (
      <ColorCard>
        {sectionTitle}
        <Typo type="title-medium" color="WHITE">
          {pickLocalized(SURVEYS_PAUSED_MESSAGE_EN, SURVEYS_PAUSED_MESSAGE_KO)}
        </Typo>
        <ActionButton $disabled aria-disabled="true">
          <Typo type="label-large" fontWeight={600}>
            {t('start_survey')}
          </Typo>
        </ActionButton>
      </ColorCard>
    );
  }

  const survey = data?.survey;
  if (!survey) return null;

  const surveyTitle = (
    <TitleRow>
      <Typo type="title-medium" color="WHITE">
        {pickLocalized(survey.title_en, survey.title_ko)}
      </Typo>
      <PointsBadge
        pointValue={survey.point_value}
        pointAward={survey.point_award}
        locked={!!survey.point_locked_by_prereq_slug}
        onLockedClick={
          survey.point_locked_by_prereq_slug ? () => setLockedModalOpen(true) : undefined
        }
      />
    </TitleRow>
  );

  const lockedModal = survey.point_locked_by_prereq_slug ? (
    <LockedBadgeModal
      visible={lockedModalOpen}
      pointValue={survey.point_value}
      prereqTitle={pickLocalized(
        survey.point_locked_by_prereq_title_en ?? survey.point_locked_by_prereq_slug,
        survey.point_locked_by_prereq_title_ko ?? survey.point_locked_by_prereq_slug,
      )}
      surveyTitle={pickLocalized(survey.title_en, survey.title_ko)}
      onClose={() => setLockedModalOpen(false)}
      onDoPrereq={() => {
        setLockedModalOpen(false);
        navigate(`/surveys/${survey.point_locked_by_prereq_slug}/answer`, {
          state: { from: location.pathname + location.search },
        });
      }}
    />
  ) : null;

  if (survey.user_has_responded) {
    return (
      <>
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
        {lockedModal}
      </>
    );
  }

  const hasDraft = hasExistingDraft(userId, survey.slug);
  const ctaLabel = hasDraft ? t('continue_survey') : t('start_survey');

  return (
    <>
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
      {lockedModal}
    </>
  );
}

export default SurveyOfTheDay;
