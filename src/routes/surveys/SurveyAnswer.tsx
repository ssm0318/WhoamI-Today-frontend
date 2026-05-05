import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { SurveyAnswerForm } from '@components/survey/SurveyAnswerForm';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { SURVEY_OF_THE_DAY_KEY } from '@hooks/useSurveyOfTheDay';
import i18n from '@i18n/index';
import { useBoundStore } from '@stores/useBoundStore';
import { getSurveyDetail } from '@utils/apis/survey';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  padding-top: ${TITLE_HEADER_HEIGHT + 16}px;
  gap: 12px;
  background: ${Colors.LIGHT};
  min-height: 100vh;
`;

const Card = styled(Layout.FlexCol)`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 16px;
  gap: 12px;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

// Forwarded through every entry-point that links to /answer so the post-
// submit Done page knows where to return the user. SurveyAnswer reads it
// from location.state and forwards it onward unchanged.
interface AnswerRouteState {
  from?: string;
}

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
    <>
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
            onSubmitted={() => {
              // Refresh the SOTD card if this submission was today's
              // daily — fire-and-forget; the user has already left this
              // page by the time the network request lands.
              mutate(SURVEY_OF_THE_DAY_KEY);
              // Replace /answer with /done in history so a Back tap from
              // the eventual entry-point page doesn't bounce the user
              // back into a half-cleared form.
              navigate(`/surveys/${survey.slug}/done`, {
                replace: true,
                state: { from },
              });
            }}
            onError={(message) => openToast({ message })}
          />
        </Card>
      </Page>
    </>
  );
}

export default SurveyAnswer;
