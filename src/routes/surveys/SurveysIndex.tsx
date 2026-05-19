import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { DeadlineBadge } from '@components/survey/DeadlineBadge';
import {
  isSurveysPaused,
  SURVEYS_PAUSED_MESSAGE_EN,
  SURVEYS_PAUSED_MESSAGE_KO,
} from '@constants/surveyPause';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { Bucket, SurveyIndexEntry } from '@models/survey';
import { getSurveyIndex } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';
import { SurveyPageShell } from './SurveyPageLayout';

const Page = styled(SurveyPageShell)`
  gap: 24px;
`;

const Section = styled(Layout.FlexCol)`
  gap: 12px;
  width: 100%;
`;

const SectionRows = styled(Layout.FlexCol)`
  gap: 12px;
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
  padding: 16px;
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

// Banner shown across the top of the surveys index while the maintenance
// window is active. Uses a soft purple bg so it reads as informational
// (not an error), and lives above all bucket sections so users see it
// before scanning their available list. Auto-hides when the pause lifts.
const PauseBanner = styled(Layout.FlexRow)`
  width: 100%;
  background: #f3e8ff;
  border: 1px solid #8700ff;
  border-radius: 12px;
  padding: 12px 16px;
  gap: 8px;
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
  const location = useLocation();
  const { data } = useSWR('/surveys/index/', getSurveyIndex);

  if (!data) return null;

  const dailyCompletedCount = data.completed.filter((e) => e.cadence === 'daily').length;
  const nonDailyCompleted = data.completed.filter((e) => e.cadence !== 'daily');

  const renderEntry = (entry: SurveyIndexEntry, bucket: Bucket) => (
    <RowCard
      key={entry.id}
      type="button"
      onClick={() =>
        // Carry `from` so the post-submit Done page returns to the
        // surveys index instead of forgetting where we came from.
        navigate(entry.redirect_url, {
          state: { from: location.pathname + location.search },
        })
      }
    >
      <RowHeader>
        <Typo type="title-medium" color="BLACK">
          {pickLocalized(entry.survey.title_en, entry.survey.title_ko)}
        </Typo>
        {bucket === 'available_now' && (
          <DeadlineBadge
            windowEnd={entry.window_end}
            cadence={entry.cadence}
            allowLate={entry.allow_late}
          />
        )}
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

  const paused = isSurveysPaused();

  // While paused, the entire "Available now" bucket is hidden — both the
  // section header and its rows — so users can't tap into the half-broken
  // answer flow from this page. Late-but-accepted and Completed buckets
  // are read-only / past-tense so they stay visible. The banner at the
  // top of the page surfaces the reason.
  const availableEntries = paused ? [] : data.available_now;
  const hasAvailable = availableEntries.length > 0;
  const hasLate = data.late_but_accepted.length > 0;
  const hasCompleted = dailyCompletedCount > 0 || nonDailyCompleted.length > 0;

  return (
    <MainScrollContainer>
      <SubHeader title={t('index_title')} />
      <Page>
        {paused && (
          <PauseBanner>
            <Typo type="body-medium" color="PRIMARY">
              🛠️ {pickLocalized(SURVEYS_PAUSED_MESSAGE_EN, SURVEYS_PAUSED_MESSAGE_KO)}
            </Typo>
          </PauseBanner>
        )}
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
              {availableEntries.map((entry) => renderEntry(entry, 'available_now'))}
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
