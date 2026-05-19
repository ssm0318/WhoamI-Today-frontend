import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { SurveyAnswerForm } from '@components/survey/SurveyAnswerForm';
import { Colors, Layout, Typo } from '@design-system';
import { SURVEY_OF_THE_DAY_KEY } from '@hooks/useSurveyOfTheDay';
import i18n from '@i18n/index';
import { SurveyIndexEntry } from '@models/survey';
import { useBoundStore } from '@stores/useBoundStore';
import { REIMBURSEMENT_KEY } from '@utils/apis/reimbursement';
import { getSurveyDetail, getSurveyIndex } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';
import { SurveyPageShell } from './SurveyPageLayout';

const Page = styled(SurveyPageShell)`
  gap: 16px;
`;

const Card = styled(Layout.FlexCol)`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 20px;
  gap: 16px;

  @media (max-width: 360px) {
    padding: 16px;
  }
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

// Forwarded through every entry-point that links to /answer so the post-
// submit Done page knows where to return the user. SurveyAnswer reads it
// from location.state and forwards it onward unchanged.
interface AnswerRouteState {
  from?: string;
}

// Pick the next unanswered SOTD scheduled for today, excluding the one
// just submitted (which may still appear unanswered in a freshly fetched
// index due to backend cache lag) and excluding daily_base (the diary,
// not a Survey-of-the-Day card). Returns null when there's nothing else
// queued, in which case the caller falls through to the Done page.
//
// Why this exists: on May 5 we co-schedule sotd_d01_honeymoon (4q) and
// sotd_d02_rsds (10q) on the same day. After the user finishes the
// first, the second isn't surfaced anywhere obvious — they'd have to
// navigate to /surveys/ and find it themselves, which most won't do.
const findNextSotdToday = (
  entries: SurveyIndexEntry[],
  justSubmittedSlug: string,
): SurveyIndexEntry | null => {
  // Sort by sequence_index so the lower-indexed SOTD wins when multiple
  // remain — matches the SOTD card's lower-seq-index preference.
  const queue = entries
    .filter(
      (e) =>
        e.cadence === 'daily' &&
        e.survey.slug !== 'daily_base' &&
        e.survey.slug !== justSubmittedSlug &&
        !e.user_answered,
    )
    .sort((a, b) => a.sequence_index - b.sequence_index);
  return queue[0] ?? null;
};

function SurveyAnswer() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const openToast = useBoundStore((s) => s.openToast);

  const { data: survey } = useSWR(slug ? `/surveys/${slug}/` : null, () =>
    getSurveyDetail(slug as string),
  );

  if (!survey) return null;

  const from = (location.state as AnswerRouteState | null)?.from;

  return (
    <MainScrollContainer>
      <SubHeader title={pickLocalized(survey.title_en, survey.title_ko)} />
      <Page>
        <Card>
          {survey.description_en && (
            <Typo type="body-medium" color="DARK_GRAY">
              {pickLocalized(survey.description_en, survey.description_ko)}
            </Typo>
          )}
          <SurveyAnswerForm
            survey={survey}
            onSubmitted={async (result) => {
              // Refresh the SOTD card if this submission was today's
              // daily — fire-and-forget; the user has already left this
              // page by the time the network request lands.
              mutate(SURVEY_OF_THE_DAY_KEY);
              mutate(REIMBURSEMENT_KEY);
              mutate('/surveys/index/');

              // SOTD chaining: when more than one SOTD is scheduled for
              // today (e.g. May 5 co-schedules d01_honeymoon + d02_rsds
              // because d01's deploy slipped), submitting the first
              // shouldn't dump the user on the Done page — they'd have
              // to find the second one themselves via /surveys/. Fetch
              // the index, see if another SOTD is queued, and chain
              // straight into it. If the fetch fails or nothing's
              // queued, fall through to /done.
              try {
                const idx = await getSurveyIndex();
                const next = findNextSotdToday(idx.available_now, survey.slug);
                if (next) {
                  navigate(`/surveys/${next.survey.slug}/answer`, {
                    replace: true,
                    state: { from },
                  });
                  return;
                }
              } catch {
                // Index fetch failure shouldn't block the user — drop
                // to /done so they at least see the acknowledgement.
              }

              // Replace /answer with /done in history so a Back tap from
              // the eventual entry-point page doesn't bounce the user
              // back into a half-cleared form.
              navigate(`/surveys/${survey.slug}/done`, {
                replace: true,
                state: { from, point_award: result.point_award },
              });
            }}
            onError={(message) => openToast({ message })}
          />
        </Card>
      </Page>
    </MainScrollContainer>
  );
}

export default SurveyAnswer;
