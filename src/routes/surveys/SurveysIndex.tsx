import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { Bucket, SurveyIndexEntry } from '@models/survey';
import { getSurveyIndex } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';

const Page = styled(Layout.FlexCol)`
  width: 100%;
  padding: 16px;
  gap: 16px;
`;

const Section = styled(Layout.FlexCol)`
  gap: 8px;
  width: 100%;
`;

const SectionRows = styled(Layout.FlexCol)`
  gap: 8px;
  width: 100%;
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

const RowHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;
`;

const CadenceChip = styled.span`
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  background: ${Colors.WHITE};
  color: ${Colors.DARK_GRAY};
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const formatDate = (iso: string): string => {
  // Reuse the user's locale; falls back to ISO if Intl can't parse.
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

function SurveysIndex() {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  const navigate = useNavigate();
  const { data } = useSWR('/surveys/index/', getSurveyIndex);

  if (!data) return null;

  const dailyCompletedCount = data.completed.filter((e) => e.cadence === 'daily').length;
  const nonDailyCompleted = data.completed.filter((e) => e.cadence !== 'daily');

  const renderEntry = (entry: SurveyIndexEntry, bucket: Bucket) => (
    <RowCard key={entry.id} type="button" onClick={() => navigate(entry.redirect_url)}>
      <RowHeader>
        <Typo type="title-medium" color="BLACK">
          {pickLocalized(entry.survey.title_en, entry.survey.title_ko)}
        </Typo>
        <CadenceChip>{t(`cadence.${entry.cadence}`)}</CadenceChip>
      </RowHeader>
      {bucket === 'late_but_accepted' && entry.window_end && (
        <Typo type="label-large" color="DARK_GRAY">
          {t('was_due', { date: formatDate(entry.window_end) })}
        </Typo>
      )}
      {bucket === 'completed' && entry.submitted_at && (
        <Typo type="label-large" color="DARK_GRAY">
          {t('submitted_on', { date: formatDate(entry.submitted_at) })}
        </Typo>
      )}
    </RowCard>
  );

  const hasAvailable = data.available_now.length > 0;
  const hasLate = data.late_but_accepted.length > 0;
  const hasCompleted = dailyCompletedCount > 0 || nonDailyCompleted.length > 0;

  return (
    <MainScrollContainer style={{ backgroundColor: Colors.LIGHT }}>
      <SubHeader title={t('index_title')} />
      <Page>
        {!hasAvailable && !hasLate && !hasCompleted && (
          <Typo type="body-medium" color="DARK_GRAY">
            {t('empty_index')}
          </Typo>
        )}

        {hasAvailable && (
          <Section>
            <Typo type="title-large" color="BLACK">
              {t('bucket_available_now')}
            </Typo>
            <SectionRows>
              {data.available_now.map((entry) => renderEntry(entry, 'available_now'))}
            </SectionRows>
          </Section>
        )}

        {hasLate && (
          <Section>
            <Typo type="title-large" color="BLACK">
              {t('bucket_late_but_accepted')}
            </Typo>
            <SectionRows>
              {data.late_but_accepted.map((entry) => renderEntry(entry, 'late_but_accepted'))}
            </SectionRows>
          </Section>
        )}

        {hasCompleted && (
          <Section>
            <Typo type="title-large" color="BLACK">
              {t('bucket_completed')}
            </Typo>
            <SectionRows>
              {dailyCompletedCount > 0 && (
                <RowCard
                  key="daily-archive-row"
                  type="button"
                  onClick={() => navigate('/surveys/daily-archive')}
                >
                  <Typo type="title-medium" color="BLACK">
                    {t('daily_archive_row', { count: dailyCompletedCount })}
                  </Typo>
                </RowCard>
              )}
              {nonDailyCompleted.map((entry) => renderEntry(entry, 'completed'))}
            </SectionRows>
          </Section>
        )}
      </Page>
    </MainScrollContainer>
  );
}

export default SurveysIndex;
