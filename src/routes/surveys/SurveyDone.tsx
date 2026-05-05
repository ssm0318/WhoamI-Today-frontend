import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { getSurveyDetail } from '@utils/apis/survey';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  padding-top: ${TITLE_HEADER_HEIGHT + 24}px;
  gap: 16px;
  background: ${Colors.LIGHT};
  min-height: 100vh;
  align-items: center;
`;

const Card = styled(Layout.FlexCol)`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 32px 20px;
  gap: 12px;
  align-items: center;
  text-align: center;
`;

const DoneButton = styled.button`
  border: 1px solid ${Colors.PRIMARY};
  background: ${Colors.PRIMARY};
  color: ${Colors.WHITE};
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

// Fallback when no entry-point was passed via route state — covers
// deep-link / refresh on /surveys/<slug>/done where we don't know what
// to "go back to". Lands on the surveys index, the safest catch-all.
const FALLBACK_FROM = '/surveys';

interface DoneRouteState {
  // The page the user was on BEFORE entering /surveys/<slug>/answer.
  // Captured at the entry-point (SurveyOfTheDay card, SurveysIndex row,
  // DailyArchive row, SurveyResults edit button) and forwarded through
  // the answer page. Falls back to /surveys for direct/refresh entries.
  from?: string;
}

function SurveyDone() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'surveys.done_page' });

  // Reusing the same SWR cache key as SurveyAnswer — by the time the user
  // lands here the survey detail is already in cache and we render
  // synchronously.
  const { data: survey } = useSWR(slug ? `/surveys/${slug}/` : null, () =>
    getSurveyDetail(slug as string),
  );

  const from = (location.state as DoneRouteState | null)?.from ?? FALLBACK_FROM;

  const handleDone = () => {
    // `replace: true` so a Back tap from the entry-point page doesn't
    // bounce the user back into the thank-you screen.
    navigate(from, { replace: true });
  };

  // Pick the body copy that matches what the survey actually does. A
  // repeatable survey gets "drop in again whenever" copy; an editable
  // one gets "you can update later" copy; everything else gets the
  // default one-shot acknowledgement.
  const bodyKey = (() => {
    if (!survey) return 'thanks_body_default';
    if (survey.repeatable) return 'thanks_body_repeatable';
    if (survey.editable) return 'thanks_body_editable';
    return 'thanks_body_default';
  })();

  return (
    <>
      <SubHeader
        title={survey ? pickLocalized(survey.title_en, survey.title_ko) : ''}
        // Hide the default left back-arrow — the user already submitted,
        // there's nothing to go back to in the form. Done is the only
        // action.
        LeftComponent={<Layout.LayoutBase w={36} h={36} />}
        RightComponent={
          <DoneButton type="button" onClick={handleDone}>
            {i18n.t('surveys.done')}
          </DoneButton>
        }
      />
      <Page>
        <Card>
          <Typo type="title-large" color="BLACK">
            {t('thanks_title')}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {t(bodyKey)}
          </Typo>
        </Card>
      </Page>
    </>
  );
}

export default SurveyDone;
