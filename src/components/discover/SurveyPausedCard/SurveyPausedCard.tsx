import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { SURVEYS_PAUSED_MESSAGE_EN, SURVEYS_PAUSED_MESSAGE_KO } from '@constants/surveyPause';
import { Typo } from '@design-system';
import i18n from '@i18n/index';

/**
 * Synthetic digest card shown ONLY while surveys are paused for
 * maintenance. Participants who only glance at the digest page (and
 * never open the Share tab or the /surveys index) would otherwise
 * silently assume there's no survey to do today — which we explicitly
 * don't want, since they DO need to do it once the pause lifts. This
 * card keeps the survey commitment visible while clearly conveying
 * "not now, come back at 4pm PT today."
 *
 * Mirrors the gradient + layout of `SurveyOfTheDay` so the visual
 * language is consistent across surfaces. The action button is render-
 * disabled (pointer-events: none + 50% opacity + aria-disabled).
 *
 * Lifecycle: `Discover.tsx` injects this card when `isSurveysPaused()`
 * returns true. Auto-disappears when the gate flips — no second deploy.
 */

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

const DisabledActionButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  align-self: flex-start;
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

function SurveyPausedCard() {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });

  return (
    <ColorCard>
      <Typo type="head-line" color="WHITE" bold>
        {t('section_title')}
      </Typo>
      <Typo type="title-medium" color="WHITE">
        {pickLocalized(SURVEYS_PAUSED_MESSAGE_EN, SURVEYS_PAUSED_MESSAGE_KO)}
      </Typo>
      <DisabledActionButton aria-disabled="true">
        <Typo type="label-large" fontWeight={600}>
          {t('start_survey')}
        </Typo>
      </DisabledActionButton>
    </ColorCard>
  );
}

export default SurveyPausedCard;
