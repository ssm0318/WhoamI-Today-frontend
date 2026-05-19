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

const CompletedRowCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 16px;
  text-align: left;
`;

const RowHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;
`;

const DraftProgressBadge = styled.span`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  border: 1px solid #b8d7c6;
  border-radius: 8px;
  background: #eaf4ef;
  color: #2f6b4f;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
`;

const TodoStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid #d8c3ff;
  border-radius: 8px;
  background: #f3e8ff;
  color: ${Colors.PRIMARY};
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
`;

const HighPriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  background: #fff1f2;
  color: #be123c;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
`;

const ResultsButton = styled.button`
  align-self: flex-start;
  border: 1px solid ${Colors.PRIMARY};
  border-radius: 8px;
  background: ${Colors.PRIMARY};
  color: ${Colors.WHITE};
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
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

const HIGH_PRIORITY_SURVEY_ORDER = new Map([
  ['phase1_friend_closeness', 0],
  ['phase2_friend_closeness', 0],
  ['goal_comparison_p1', 1],
  ['goal_comparison_p2', 1],
  ['mid_study_w', 2],
  ['mid_study_q', 2],
  ['post_study_w', 2],
  ['post_study_q', 2],
  ['feature_eval_w', 3],
]);

const HIGH_PRIORITY_SURVEY_SLUGS = new Set([
  'phase1_friend_closeness',
  'phase2_friend_closeness',
  'feature_eval_w',
  'mid_study_w',
  'mid_study_q',
  'post_study_w',
  'post_study_q',
  'goal_comparison_p1',
  'goal_comparison_p2',
]);

const isHighPrioritySurvey = (entry: SurveyIndexEntry): boolean =>
  HIGH_PRIORITY_SURVEY_SLUGS.has(entry.survey.slug);

const isDailyOrSotd = (entry: SurveyIndexEntry): boolean =>
  entry.cadence === 'daily' ||
  entry.survey.slug === 'habit_platform' ||
  entry.survey.slug.startsWith('sotd_');

const isNoDeadlineDropIn = (entry: SurveyIndexEntry): boolean =>
  entry.cadence === 'anytime' && !entry.window_end;

const todoPriorityRank = (entry: SurveyIndexEntry): number => {
  if (isHighPrioritySurvey(entry)) return 0;
  if (isDailyOrSotd(entry)) return 2;
  if (isNoDeadlineDropIn(entry)) return 3;
  return 1;
};

const highPrioritySurveyOrder = (entry: SurveyIndexEntry): number =>
  HIGH_PRIORITY_SURVEY_ORDER.get(entry.survey.slug) ?? Number.MAX_SAFE_INTEGER;

const sidebarOrder = (entry: SurveyIndexEntry): number =>
  entry.sidebar_order ?? Number.MAX_SAFE_INTEGER;

const sortTodoEntries = (entries: SurveyIndexEntry[]): SurveyIndexEntry[] =>
  entries
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) =>
        sidebarOrder(a.entry) - sidebarOrder(b.entry) ||
        todoPriorityRank(a.entry) - todoPriorityRank(b.entry) ||
        highPrioritySurveyOrder(a.entry) - highPrioritySurveyOrder(b.entry) ||
        a.index - b.index,
    )
    .map(({ entry }) => entry);

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

  const navigateToEntry = (entry: SurveyIndexEntry) =>
    // Carry `from` so the post-submit Done page returns to the
    // surveys index instead of forgetting where we came from.
    navigate(entry.redirect_url, {
      state: { from: location.pathname + location.search },
    });

  const renderEntryContent = (entry: SurveyIndexEntry, bucket: Bucket) => (
    <>
      <RowHeader>
        <Typo type="title-medium" color="BLACK">
          {pickLocalized(entry.survey.title_en, entry.survey.title_ko)}
        </Typo>
        {bucket !== 'completed' && isHighPrioritySurvey(entry) && (
          <HighPriorityBadge>{t('high_priority')}</HighPriorityBadge>
        )}
        {bucket === 'available_now' && (
          <DeadlineBadge
            windowEnd={entry.window_end}
            cadence={entry.cadence}
            allowLate={entry.allow_late}
          />
        )}
        {bucket === 'late_but_accepted' && (
          <TodoStatusBadge>{t('bucket_late_but_accepted')}</TodoStatusBadge>
        )}
        {bucket !== 'completed' && entry.draft && entry.draft.progress_pct > 0 && (
          <DraftProgressBadge>
            {t('draft_progress', { progress: entry.draft.progress_pct })}
          </DraftProgressBadge>
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
    </>
  );

  const renderEntry = (entry: SurveyIndexEntry, bucket: Bucket) => {
    if (bucket === 'completed') {
      return (
        <CompletedRowCard key={entry.id}>
          {renderEntryContent(entry, bucket)}
          {entry.results_unlocked && (
            <ResultsButton type="button" onClick={() => navigateToEntry(entry)}>
              {t('check_results')}
            </ResultsButton>
          )}
        </CompletedRowCard>
      );
    }

    return (
      <RowCard key={entry.id} type="button" onClick={() => navigateToEntry(entry)}>
        {renderEntryContent(entry, bucket)}
      </RowCard>
    );
  };

  const paused = isSurveysPaused();

  // While paused, hide currently open surveys so users can't tap into the
  // half-broken answer flow from this page. Late-but-accepted and Completed
  // entries are past-tense / already-open states so they stay visible.
  const availableEntries = paused ? [] : data.available_now;
  const todoEntries = sortTodoEntries([...availableEntries, ...data.late_but_accepted]);
  const hasTodo = todoEntries.length > 0;
  const hasCompleted = data.completed.length > 0;

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
        {!hasTodo && !hasCompleted && (
          <Typo type="body-medium" color="DARK_GRAY">
            {t('empty_index')}
          </Typo>
        )}

        {hasTodo && (
          <Section>
            <Typo type="title-large" color="BLACK">
              {t('bucket_todo')}
            </Typo>
            <SectionRows>
              {todoEntries.map((entry) => renderEntry(entry, entry.bucket))}
            </SectionRows>
          </Section>
        )}

        {hasCompleted && (
          <Section>
            <Typo type="title-large" color="BLACK">
              {t('bucket_completed')}
            </Typo>
            <SectionRows>
              {data.completed.map((entry) => renderEntry(entry, 'completed'))}
            </SectionRows>
          </Section>
        )}
      </Page>
    </MainScrollContainer>
  );
}

export default SurveysIndex;
