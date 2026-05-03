import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { SurveyAnswerForm } from '@components/survey/SurveyAnswerForm';
import { TestingDisclaimer } from '@components/survey/TestingDisclaimer';
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

function SurveyAnswer() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const navigate = useNavigate();
  const openToast = useBoundStore((s) => s.openToast);

  const { data: survey } = useSWR(slug ? `/surveys/${slug}/` : null, () =>
    getSurveyDetail(slug as string),
  );

  if (!survey) return null;

  return (
    <>
      <SubHeader title={pickLocalized(survey.title_en, survey.title_ko)} />
      <Page>
        <TestingDisclaimer />
        <Card>
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
              // Replace so back-from-/results skips the answer page (avoids
              // 409 "Already submitted") and lands on the entry page.
              navigate(`/surveys/${survey.slug}/results`, { replace: true });
            }}
            onError={(message) => openToast({ message })}
          />
        </Card>
      </Page>
    </>
  );
}

export default SurveyAnswer;
