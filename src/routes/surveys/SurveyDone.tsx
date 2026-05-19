import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { PointAwardSummary } from '@models/reimbursement';
import { getSurveyDetail } from '@utils/apis/survey';

import { REIMBURSEMENT_POINTS_TBU } from '../../utils/reimbursementAvailability';
import { MainScrollContainer } from '../Root';
import { SurveyPageShell } from './SurveyPageLayout';

const Page = styled(SurveyPageShell)`
  gap: 16px;
  align-items: center;
`;

const Card = styled(Layout.FlexCol)`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 36px 24px;
  gap: 16px;
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

const PointLine = styled.div`
  width: 100%;
  border-radius: 8px;
  background: #f3e8ff;
  padding: 10px 12px;
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
  point_award?: PointAwardSummary | null;
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
  const pointAward = (location.state as DoneRouteState | null)?.point_award ?? null;

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
    <MainScrollContainer>
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
          {!REIMBURSEMENT_POINTS_TBU && pointAward && (
            <PointLine>
              <Typo
                type="label-large"
                color={pointAward.effective_points > 0 ? 'PRIMARY' : 'DARK_GRAY'}
              >
                {pointAward.effective_points > 0
                  ? t('done_points_awarded', { points: pointAward.effective_points })
                  : t('done_points_locked', { note: pointAward.note })}
              </Typo>
            </PointLine>
          )}
        </Card>
      </Page>
    </MainScrollContainer>
  );
}

export default SurveyDone;
