import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import { SurveyAnswerForm } from '@components/survey/SurveyAnswerForm';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { useBoundStore } from '@stores/useBoundStore';
import { getSurveyDetail } from '@utils/apis/survey';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
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
    <Page>
      <Card>
        <Typo type="title-large" color="BLACK">
          {pickLocalized(survey.title_en, survey.title_ko)}
        </Typo>
        {survey.description_en && (
          <Typo type="body-medium" color="DARK_GRAY">
            {pickLocalized(survey.description_en, survey.description_ko)}
          </Typo>
        )}
        <SurveyAnswerForm
          survey={survey}
          onSubmitted={() => {
            openToast({ message: t('toast.submitted') });
            navigate(`/surveys/${survey.slug}/results`);
          }}
          onError={(message) => openToast({ message })}
        />
      </Card>
    </Page>
  );
}

export default SurveyAnswer;
