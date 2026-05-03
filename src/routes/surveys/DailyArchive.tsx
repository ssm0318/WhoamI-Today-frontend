import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { PastSurvey } from '@models/survey';
import { getPastSurveys } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  gap: 12px;
`;

const RowCard = styled.button`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
`;

const StatusChip = styled.span<{ unanswered: boolean }>`
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px ${({ unanswered }) => (unanswered ? 'dashed' : 'solid')} ${Colors.LIGHT_GRAY};
  background: ${Colors.WHITE};
  color: ${({ unanswered }) => (unanswered ? Colors.DARK_GRAY : Colors.PRIMARY)};
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

function DailyArchive() {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const navigate = useNavigate();
  const { data } = useSWR('/surveys/past/', getPastSurveys);

  const handleClick = (row: PastSurvey) => {
    if (row.user_answered) {
      navigate(`/surveys/${row.survey.slug}/results`);
    } else {
      navigate(`/surveys/${row.survey.slug}/answer`);
    }
  };

  if (!data) return null;

  return (
    <MainScrollContainer style={{ backgroundColor: Colors.LIGHT }}>
      <SubHeader title={t('archive_title')} />
      <Page>
        {data.results.length === 0 && (
          <Typo type="body-medium" color="DARK_GRAY">
            {t('archive_empty')}
          </Typo>
        )}
        {data.results.map((row) => (
          <RowCard key={row.date} type="button" onClick={() => handleClick(row)}>
            <Typo type="label-large" color="DARK_GRAY">
              {row.date}
            </Typo>
            <Typo type="title-medium" color="BLACK">
              {pickLocalized(row.survey.title_en, row.survey.title_ko)}
            </Typo>
            <StatusChip unanswered={!row.user_answered}>
              {row.user_answered ? t('answered_view_results') : t('answer_to_view_results')}
            </StatusChip>
          </RowCard>
        ))}
      </Page>
    </MainScrollContainer>
  );
}

export default DailyArchive;
