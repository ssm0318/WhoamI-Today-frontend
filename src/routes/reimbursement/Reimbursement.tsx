import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { LocalAllocationPreview, LocalPreviewRow, ReimbursementAward } from '@models/reimbursement';
import { SurveyIndexEntry, SurveyIndexResponse } from '@models/survey';
import {
  getLocalAllocationPreview,
  getReimbursementState,
  LOCAL_ALLOCATION_PREVIEW_KEY,
  REIMBURSEMENT_KEY,
  shouldUseLocalAllocationPreview,
} from '@utils/apis/reimbursement';
import { getSurveyIndex } from '@utils/apis/survey';

import { REIMBURSEMENT_POINTS_TBU } from '../../utils/reimbursementAvailability';
import { MainScrollContainer } from '../Root';

const PREVIEW_POINTS_PER_DOLLAR = 10;
const INTERVIEW_SIGNUP_POINTS = 200;
const LOCAL_ALLOCATION_PREVIEW_BROWSER_CACHE_KEY = `${LOCAL_ALLOCATION_PREVIEW_KEY}:browser-cache:v1`;

const Page = styled.main`
  min-height: 100%;
  padding: 12px 20px 88px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  background: #fff;
`;

const SummaryCard = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #d8c3ff;
  border-radius: 8px;
  background: #fbf8ff;
  padding: 18px;
`;

const TbuCard = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #d8c3ff;
  border-radius: 8px;
  background: #fbf8ff;
  padding: 20px;
`;

const NoticeCard = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #ead48f;
  border-radius: 8px;
  background: #fff9e7;
  padding: 14px 16px;
`;

const TbuTitle = styled.h1`
  margin: 4px 0;
  color: #1f1f1f;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
`;

const SummaryNumber = styled.h1`
  margin: 8px 0 4px;
  color: #1f1f1f;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.1;
`;

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:last-child {
    margin-bottom: 28px;
  }
`;

const HelpSection = styled(Section)`
  gap: 16px;
  padding-bottom: 48px;
`;

const AwardList = styled.div`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 8px;
  overflow: hidden;
`;

const AwardRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  padding: 12px 14px;
  background: ${Colors.WHITE};

  & + & {
    border-top: 1px solid ${Colors.LIGHT_GRAY};
  }
`;

const RowMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #f3e8ff;
  color: #8700ff;
  padding: 3px 7px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
`;

const PointsMetaChip = styled(MetaChip)`
  background: #eaf4ef;
  color: #2f6b4f;
`;

const PriorityMetaChip = styled(MetaChip)<{ $level: 'must' | 'high' }>`
  background: ${({ $level }) => ($level === 'must' ? '#fee2e2' : '#fff1f2')};
  color: ${({ $level }) => ($level === 'must' ? '#991b1b' : '#be123c')};
`;

const DeadlineMetaChip = styled(MetaChip)`
  background: #ffe8d5;
  color: #c76a1f;
`;

const PointsCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  white-space: nowrap;
`;

const ActionLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border-radius: 8px;
  background: #8700ff;
  color: #fff;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
`;

const OriginalPoints = styled.s`
  color: #6f6f78;
  font-size: 12px;
  font-weight: 600;
`;

const EmptySectionCard = styled.div`
  width: 100%;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 8px;
  background: #fafafa;
  padding: 12px 14px;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const formatCurrency = (cents: number): string => (cents / 100).toFixed(2);

function readCachedLocalAllocationPreview(): LocalAllocationPreview | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = window.localStorage.getItem(LOCAL_ALLOCATION_PREVIEW_BROWSER_CACHE_KEY);
    return cached ? (JSON.parse(cached) as LocalAllocationPreview) : null;
  } catch {
    return null;
  }
}

function writeCachedLocalAllocationPreview(preview: LocalAllocationPreview): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      LOCAL_ALLOCATION_PREVIEW_BROWSER_CACHE_KEY,
      JSON.stringify(preview),
    );
  } catch {
    // Browser storage is best-effort only; the live preview can still render.
  }
}

function actionText(row: LocalPreviewRow): string {
  if (row.status === 'locked' && row.gateSlug) return 'Do prereq';
  if (row.kind === 'survey') return 'Take survey';
  if (row.slug.startsWith('wit_bot_audit')) return 'Open WIT chat';
  if (row.slug === 'interview_signup') return 'Ask admin';
  if (row.slug === 'friend_invite') return 'Invite friends';
  return 'Open';
}

function missedCopy(row: LocalPreviewRow): string {
  if (row.slug === 'friend_invite') {
    return 'Friend invite reimbursement details will be updated.';
  }
  if (row.note.toLowerCase().includes('deadline')) {
    return 'The deadline has passed. Ask an admin if you think this should still count.';
  }
  return 'This may need admin review before points can count.';
}

function currentPossiblePoints(row: LocalPreviewRow): number {
  return row.currentPossiblePoints ?? row.possiblePoints;
}

function shouldShowCategoryBadge(category: string): boolean {
  return category.trim().toLowerCase() !== 'recovery';
}

function PreviewRowBadges({ row }: { row: LocalPreviewRow }) {
  const { t } = useTranslation('translation', { keyPrefix: 'deadline_badge' });
  const displayPoints = currentPossiblePoints(row);

  return (
    <RowMeta>
      {shouldShowCategoryBadge(row.category) && <MetaChip>{row.category}</MetaChip>}
      <PointsMetaChip>+{displayPoints} pts</PointsMetaChip>
      {row.priorityRating === 1 && (
        <PriorityMetaChip $level="must">Prerequisite/Must Complete</PriorityMetaChip>
      )}
      {row.priorityRating === 2 && <PriorityMetaChip $level="high">High Priority</PriorityMetaChip>}
      {row.availability === 'late' && <DeadlineMetaChip>Late credit</DeadlineMetaChip>}
      {row.availability === 'deadline' && (
        <DeadlineMetaChip>⏰ {t('deadline_passed')}</DeadlineMetaChip>
      )}
    </RowMeta>
  );
}

function EarnedRows({ rows }: { rows: LocalPreviewRow[] }) {
  if (rows.length === 0) return null;

  return (
    <Section>
      <Typo type="title-medium" color="BLACK">
        Points you earned
      </Typo>
      <AwardList>
        {rows.map((row) => (
          <AwardRow key={row.key}>
            <Layout.FlexCol gap={3}>
              <Typo type="body-medium" color="BLACK">
                {row.title}
              </Typo>
              <PreviewRowBadges row={row} />
              {row.note && (
                <Typo type="label-medium" color="DARK_GRAY">
                  {row.note}
                </Typo>
              )}
            </Layout.FlexCol>
            <PointsCell>
              <Typo type="title-medium" color="BLACK">
                {row.points} pts
              </Typo>
              {row.rawPoints !== row.points && <OriginalPoints>{row.rawPoints} pts</OriginalPoints>}
            </PointsCell>
          </AwardRow>
        ))}
      </AwardList>
    </Section>
  );
}

function ActionRows({ title, rows }: { title: string; rows: LocalPreviewRow[] }) {
  if (rows.length === 0) return null;

  return (
    <Section>
      <Typo type="title-medium" color="BLACK">
        {title}
      </Typo>
      <AwardList>
        {rows.map((row) => (
          <AwardRow key={row.key}>
            <Layout.FlexCol gap={4}>
              <Typo type="body-medium" color="BLACK">
                {row.title}
              </Typo>
              <PreviewRowBadges row={row} />
              <Typo type="label-medium" color="DARK_GRAY">
                {row.status === 'locked' && row.gateSlug
                  ? row.note
                  : row.availability === 'late'
                  ? row.note ||
                    `Late submissions are still accepted. Current draft credit is ${currentPossiblePoints(
                      row,
                    )} pts.`
                  : `Complete this to earn ${currentPossiblePoints(row)} pts.`}
              </Typo>
            </Layout.FlexCol>
            <PointsCell>
              <Typo type="title-medium" color="BLACK">
                +{currentPossiblePoints(row)} pts
              </Typo>
              {row.appUrl && <ActionLink href={row.appUrl}>{actionText(row)}</ActionLink>}
            </PointsCell>
          </AwardRow>
        ))}
      </AwardList>
    </Section>
  );
}

function HelpRows({ rows }: { rows: LocalPreviewRow[] }) {
  if (rows.length === 0) return null;

  return (
    <HelpSection>
      <Typo type="title-medium" color="BLACK">
        Need help with missed points?
      </Typo>
      <AwardList>
        {rows.map((row) => (
          <AwardRow key={row.key}>
            <Layout.FlexCol gap={4}>
              <Typo type="body-medium" color="BLACK">
                {row.title}
              </Typo>
              <PreviewRowBadges row={row} />
              <Typo type="label-medium" color="DARK_GRAY">
                {missedCopy(row)}
              </Typo>
            </Layout.FlexCol>
            <PointsCell>
              <Typo type="title-medium" color="BLACK">
                {row.possiblePoints} pts
              </Typo>
              {row.slug === 'friend_invite' ? (
                <Typo type="label-medium" color="DARK_GRAY">
                  Will be updated
                </Typo>
              ) : (
                <ActionLink href="/chats">Ask admin</ActionLink>
              )}
            </PointsCell>
          </AwardRow>
        ))}
      </AwardList>
    </HelpSection>
  );
}

function UpcomingRows({ rows }: { rows: LocalPreviewRow[] }) {
  if (rows.length === 0) return null;

  return (
    <Section>
      <Typo type="title-medium" color="BLACK">
        Available later
      </Typo>
      <AwardList>
        {rows.map((row) => (
          <AwardRow key={row.key}>
            <Layout.FlexCol gap={4}>
              <Typo type="body-medium" color="BLACK">
                {row.title}
              </Typo>
              <PreviewRowBadges row={row} />
              <Typo type="label-medium" color="DARK_GRAY">
                This activity is not open yet. Check back later.
              </Typo>
            </Layout.FlexCol>
            <PointsCell>
              <Typo type="title-medium" color="BLACK">
                {row.possiblePoints} pts
              </Typo>
            </PointsCell>
          </AwardRow>
        ))}
      </AwardList>
    </Section>
  );
}

function EmptyActionSection() {
  return (
    <Section>
      <Typo type="title-medium" color="BLACK">
        Earn more points
      </Typo>
      <EmptySectionCard>
        <Typo type="body-medium" color="DARK_GRAY">
          No point-earning activities are open right now. Check the Surveys page for updates.
        </Typo>
      </EmptySectionCard>
    </Section>
  );
}

function categoryForSurvey(entry: SurveyIndexEntry): string {
  if (entry.cadence === 'daily') return 'Daily diary';
  if (entry.cadence === 'weekly' || entry.cadence === 'anytime') return 'Weekly / anytime';
  if (entry.cadence === 'endpoint' || entry.cadence === 'biweekly') {
    return 'Phase / feature surveys';
  }
  return 'Survey';
}

function priorityRatingForSlug(slug: string): number {
  if (slug === 'feature_eval_w' || slug === 'feature_eval_w_part2') return 1;
  if (
    [
      'phase1_friend_closeness',
      'phase2_friend_closeness',
      'goal_comparison_p1',
      'goal_comparison_p2',
      'mid_study_w',
      'mid_study_q',
      'post_study_w',
      'post_study_q',
    ].includes(slug)
  ) {
    return 2;
  }
  return 0;
}

function surveyEntryToPreviewRow(
  entry: SurveyIndexEntry,
  openSurveySlugs: Set<string>,
): LocalPreviewRow | null {
  if (entry.point_value <= 0 || entry.point_award) return null;

  const prereqSlug = entry.point_locked_by_prereq_slug || '';
  if (prereqSlug && !openSurveySlugs.has(prereqSlug)) return null;

  const lockedByAvailablePrereq = !!prereqSlug;
  const appUrl = lockedByAvailablePrereq
    ? `/surveys/${encodeURIComponent(prereqSlug)}/answer`
    : entry.redirect_url;

  return {
    key: `survey:${entry.id}`,
    kind: 'survey',
    slug: entry.survey.slug,
    title: pickLocalized(entry.survey.title_en, entry.survey.title_ko),
    category: categoryForSurvey(entry),
    points: 0,
    rawPoints: 0,
    possiblePoints: entry.point_value,
    currentPossiblePoints: entry.point_value,
    completedCount: 0,
    appUrl,
    canEarn: true,
    availability: entry.bucket === 'late_but_accepted' ? 'late' : 'available',
    capGroup: '',
    capPoints: null,
    gateSlug: prereqSlug,
    latePercent: 100,
    priorityRating: priorityRatingForSlug(entry.survey.slug),
    status: lockedByAvailablePrereq ? 'locked' : 'pending',
    note: lockedByAvailablePrereq
      ? `Complete ${pickLocalized(
          entry.point_locked_by_prereq_title_en || prereqSlug,
          entry.point_locked_by_prereq_title_ko || prereqSlug,
        )} first so this survey can count for points.`
      : '',
  };
}

function awardToPreviewRow(award: ReimbursementAward): LocalPreviewRow {
  const adjusted = award.adjusted_points !== null && award.adjusted_points !== award.awarded_points;
  const category =
    award.source_kind === 'survey'
      ? 'Surveys'
      : award.source_kind === 'app_usage'
      ? 'App usage'
      : 'Other activities';

  return {
    key: `${award.source_kind}:${award.source_slug}:${award.scheduled_survey_id || 'manual'}`,
    kind: award.source_kind === 'survey' ? 'survey' : 'manual',
    slug: award.source_slug,
    title: pickLocalized(award.title_en, award.title_ko),
    category,
    points: award.effective_points,
    rawPoints: adjusted ? award.awarded_points : award.effective_points,
    possiblePoints: Math.max(award.awarded_points, award.effective_points),
    currentPossiblePoints: award.effective_points,
    completedCount: 1,
    appUrl: '',
    canEarn: false,
    availability: 'no_action',
    capGroup: '',
    capPoints: null,
    gateSlug: '',
    latePercent: 100,
    priorityRating: 0,
    status: 'earned',
    note: award.note,
  };
}

function interviewSignupUpcomingRow(hasInterviewAward: boolean): LocalPreviewRow[] {
  if (hasInterviewAward) return [];
  return [
    {
      key: 'manual:interview_signup',
      kind: 'manual',
      slug: 'interview_signup',
      title: 'Interview signup',
      category: 'Other activities',
      points: 0,
      rawPoints: 0,
      possiblePoints: INTERVIEW_SIGNUP_POINTS,
      currentPossiblePoints: INTERVIEW_SIGNUP_POINTS,
      completedCount: 0,
      appUrl: '',
      canEarn: false,
      availability: 'future',
      capGroup: '',
      capPoints: null,
      gateSlug: '',
      latePercent: 100,
      priorityRating: 0,
      status: 'pending',
      note: 'Interview signup is not open yet.',
    },
  ];
}

function ProductionReimbursementPage({
  data,
  surveyIndex,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getReimbursementState>>>;
  surveyIndex: SurveyIndexResponse | undefined;
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const openSurveyEntries = [
    ...(surveyIndex?.available_now || []),
    ...(surveyIndex?.late_but_accepted || []),
  ];
  const openSurveySlugs = new Set(openSurveyEntries.map((entry) => entry.survey.slug));
  const earnMoreRows = openSurveyEntries
    .map((entry) => surveyEntryToPreviewRow(entry, openSurveySlugs))
    .filter((row): row is LocalPreviewRow => row !== null);
  const earnedRows = data.awards.map(awardToPreviewRow);
  const upcomingRows = interviewSignupUpcomingRow(
    data.awards.some((award) => award.source_slug === 'interview_signup'),
  );
  const hasSurveyIndex = !!surveyIndex;

  return (
    <MainScrollContainer>
      <SubHeader title={i18n.t('header.reimbursement')} />
      <Page aria-labelledby="reimbursement-title">
        <NoticeCard>
          <Typo type="label-large" color="PRIMARY">
            {t('local_preview_notice_title')}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {t('local_preview_notice_body')}
          </Typo>
        </NoticeCard>

        <SummaryCard>
          <Typo type="label-large" color="PRIMARY">
            {t('summary_title')}
          </Typo>
          <SummaryNumber id="reimbursement-title">{data.adjusted_total} pts</SummaryNumber>
          <Typo type="title-medium" color="BLACK">
            {t('dollar_estimate_label', {
              amount: formatCurrency(data.dollar_estimate_cents),
            })}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {data.points_per_dollar} pts = $1. Final reimbursement may change after study review.
          </Typo>
          <Typo type="label-medium" color="DARK_GRAY">
            {t('study_max_note_body')}
          </Typo>
        </SummaryCard>

        {hasSurveyIndex && earnMoreRows.length === 0 ? (
          <EmptyActionSection />
        ) : (
          <ActionRows title="Earn more points" rows={earnMoreRows} />
        )}
        <UpcomingRows rows={upcomingRows} />
        <EarnedRows rows={earnedRows} />
      </Page>
    </MainScrollContainer>
  );
}

function LocalAllocationPreviewPage({ preview }: { preview: LocalAllocationPreview }) {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const earnedRows = preview.rows.filter((row) => row.points > 0);
  const earnMoreRows = preview.rows.filter((row) => row.points === 0 && row.canEarn);
  const upcomingRows = preview.rows.filter(
    (row) => row.points === 0 && row.availability === 'future',
  );
  const helpRows = preview.rows.filter(
    (row) => row.points === 0 && !row.canEarn && row.availability !== 'future',
  );
  const pointsPerDollar = preview.pointsPerDollar || PREVIEW_POINTS_PER_DOLLAR;

  return (
    <MainScrollContainer>
      <SubHeader title={i18n.t('header.reimbursement')} />
      <Page aria-labelledby="reimbursement-title">
        <NoticeCard>
          <Typo type="label-large" color="PRIMARY">
            {t('local_preview_notice_title')}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {t('local_preview_notice_body')}
          </Typo>
        </NoticeCard>

        <SummaryCard>
          <Typo type="label-large" color="PRIMARY">
            {t('summary_title')}
          </Typo>
          <SummaryNumber id="reimbursement-title">{preview.earnedPoints} pts</SummaryNumber>
          <Typo type="title-medium" color="BLACK">
            {t('dollar_estimate_label', { amount: preview.estimatedDollars })}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {pointsPerDollar} pts = $1. Final reimbursement may change after study review.
          </Typo>
          <Typo type="label-medium" color="DARK_GRAY">
            {t('study_max_note_body')}
          </Typo>
        </SummaryCard>

        <ActionRows title="Earn more points" rows={earnMoreRows} />
        <UpcomingRows rows={upcomingRows} />
        <EarnedRows rows={earnedRows} />
        <HelpRows rows={helpRows} />
      </Page>
    </MainScrollContainer>
  );
}

function ReimbursementLoadingPage({ message }: { message: string }) {
  return (
    <MainScrollContainer>
      <SubHeader title={i18n.t('header.reimbursement')} />
      <Page aria-labelledby="reimbursement-title">
        <NoticeCard>
          <Typo type="label-large" color="PRIMARY">
            Reimbursement preview
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {message}
          </Typo>
        </NoticeCard>
      </Page>
    </MainScrollContainer>
  );
}

function Reimbursement() {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const useLocalPreview = shouldUseLocalAllocationPreview();
  const [localPreviewFallback] = useState<LocalAllocationPreview | null>(() =>
    useLocalPreview ? readCachedLocalAllocationPreview() : null,
  );
  const { data } = useSWR(
    REIMBURSEMENT_POINTS_TBU || useLocalPreview ? null : REIMBURSEMENT_KEY,
    getReimbursementState,
  );
  const { data: surveyIndex } = useSWR(
    REIMBURSEMENT_POINTS_TBU || useLocalPreview ? null : '/surveys/index/',
    getSurveyIndex,
  );
  const { data: localPreview } = useSWR(
    useLocalPreview ? [LOCAL_ALLOCATION_PREVIEW_KEY, null] : null,
    getLocalAllocationPreview,
  );
  const resolvedLocalPreview = localPreview ?? localPreviewFallback;

  useEffect(() => {
    if (!useLocalPreview || !localPreview) return;

    writeCachedLocalAllocationPreview(localPreview);
  }, [localPreview, useLocalPreview]);

  if (resolvedLocalPreview) return <LocalAllocationPreviewPage preview={resolvedLocalPreview} />;
  if (useLocalPreview) {
    return <ReimbursementLoadingPage message="Loading your point allocation preview..." />;
  }

  if (REIMBURSEMENT_POINTS_TBU) {
    return (
      <MainScrollContainer>
        <SubHeader title={i18n.t('header.reimbursement')} />
        <Page aria-labelledby="reimbursement-title">
          <TbuCard>
            <Typo type="label-large" color="PRIMARY">
              {t('tbu_eyebrow')}
            </Typo>
            <TbuTitle id="reimbursement-title">{t('tbu_title')}</TbuTitle>
            <Typo type="body-medium" color="DARK_GRAY">
              {t('tbu_body')}
            </Typo>
          </TbuCard>
        </Page>
      </MainScrollContainer>
    );
  }

  if (!data) return <ReimbursementLoadingPage message="Loading reimbursement details..." />;
  return <ProductionReimbursementPage data={data} surveyIndex={surveyIndex} />;
}

export default Reimbursement;
