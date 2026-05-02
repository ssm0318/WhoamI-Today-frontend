import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import i18n from '@i18n/index';
import { SurveyResultsCardBody } from '@models/discover';

import * as S from './SurveyResultsCard.styled';

interface SurveyResultsCardProps {
  card: SurveyResultsCardBody;
}

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

function SurveyResultsCard({ card }: SurveyResultsCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const trackEvent = useTrackEvent();

  const handleClick = () => {
    trackEvent('survey_results_card_tapped', { survey_slug: card.slug });
    navigate(`/surveys/${card.slug}/results`);
  };

  return (
    <S.SurveyResultsWrapper>
      <Layout.FlexCol gap={8} w="100%">
        <Layout.FlexRow bgColor="SECONDARY" ph={8} pv={2} rounded={100}>
          <Typo bold type="label-medium" color="WHITE">
            {t('section_results_released')}
          </Typo>
        </Layout.FlexRow>
        <Typo type="title-medium" color="WHITE">
          {pickLocalized(card.titleEn, card.titleKo)}
        </Typo>
        <Typo type="label-medium" color="WHITE">
          {card.date}
        </Typo>
      </Layout.FlexCol>
      <S.ViewResultsButton onClick={handleClick}>
        <Typo type="label-large" color="PRIMARY" fontWeight={600}>
          {t('view_results')}
        </Typo>
      </S.ViewResultsButton>
    </S.SurveyResultsWrapper>
  );
}

export default SurveyResultsCard;
