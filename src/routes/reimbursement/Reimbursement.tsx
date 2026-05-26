import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { ReimbursementAward } from '@models/reimbursement';
import { useBoundStore } from '@stores/useBoundStore';
import { getReimbursementState, REIMBURSEMENT_KEY } from '@utils/apis/reimbursement';

import { REIMBURSEMENT_POINTS_TBU } from '../../utils/reimbursementAvailability';
import { MainScrollContainer } from '../Root';

const LOCAL_ALLOCATION_PREVIEW_KEY = 'local-reimbursement-allocation-preview';
const LOCAL_REIMBURSEMENT_PREVIEW_URL = 'http://127.0.0.1:4177/api/reimbursement-preview';
const PREVIEW_POINTS_PER_DOLLAR = 10;

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

const PendingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px dashed #b8b8c2;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fafafa;
`;

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const formatCurrency = (cents: number): string => (cents / 100).toFixed(2);

interface LocalPreviewRow {
  key: string;
  kind: 'survey' | 'manual';
  slug: string;
  title: string;
  category: string;
  points: number;
  rawPoints: number;
  possiblePoints: number;
  currentPossiblePoints?: number;
  completedCount: number;
  appUrl: string;
  canEarn: boolean;
  availability: 'available' | 'late' | 'future' | 'deadline' | 'no_action';
  capGroup: string;
  capPoints: number | null;
  gateSlug: string;
  latePercent: number;
  priorityRating: number;
  status: 'earned' | 'pending' | 'locked';
  note: string;
}

interface LocalPreviewRule {
  group: string;
  capPoints: number | null;
  sourceCount: number;
  availablePoints: number;
  earnedPoints: number;
}

interface LocalPreviewUser {
  id: number | null;
  username: string;
  responseTotal: number;
}

interface LocalPreviewDb {
  name: string;
  participantCount: number;
}

interface LocalAllocationPreview {
  db: LocalPreviewDb;
  selectedUser: LocalPreviewUser;
  pointsPerDollar: number;
  availableMax: number;
  earnedPoints: number;
  estimatedDollars: string;
  sourceCount: number;
  rows: LocalPreviewRow[];
  capRules: LocalPreviewRule[];
  gateRules: LocalPreviewRow[];
  lateRules: LocalPreviewRow[];
}

const shouldUseLocalAllocationPreview = (): boolean =>
  REIMBURSEMENT_POINTS_TBU &&
  process.env.NODE_ENV !== 'production' &&
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const getLocalAllocationPreview = async ([, userId]: readonly [
  string,
  number | null,
]): Promise<LocalAllocationPreview | null> => {
  const url = new URL(LOCAL_REIMBURSEMENT_PREVIEW_URL);
  if (userId !== null) url.searchParams.set('user_id', String(userId));
  return new Promise((resolve) => {
    if (typeof XMLHttpRequest !== 'undefined') {
      const request = new XMLHttpRequest();
      request.open('GET', url.toString());
      request.onload = () => {
        if (request.status < 200 || request.status >= 300) {
          resolve(null);
          return;
        }
        resolve(JSON.parse(request.responseText) as LocalAllocationPreview);
      };
      request.onerror = () => resolve(null);
      request.send();
      return;
    }

    const callbackName = `__whoamiReimbursementPreview${Date.now()}`;
    url.searchParams.set('callback', callbackName);
    const script = document.createElement('script');
    let settled = false;
    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
    };
    (window as unknown as Record<string, unknown>)[callbackName] = (
      payload: LocalAllocationPreview,
    ) => {
      settled = true;
      cleanup();
      resolve(payload);
    };
    script.onerror = () => {
      if (!settled) {
        cleanup();
        resolve(null);
      }
    };
    script.src = url.toString();
    document.body.appendChild(script);
  });
};

function AwardPoints({ award }: { award: ReimbursementAward }) {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const adjusted = award.adjusted_points !== null && award.adjusted_points !== award.awarded_points;

  return (
    <PointsCell>
      <Typo type="title-medium" color="BLACK">
        {award.effective_points} pts
      </Typo>
      {adjusted && <OriginalPoints>{award.awarded_points} pts</OriginalPoints>}
      {adjusted && (
        <Typo type="label-medium" color="DARK_GRAY">
          {t('downgraded_label')}
        </Typo>
      )}
    </PointsCell>
  );
}

function AwardGroup({ title, awards }: { title: string; awards: ReimbursementAward[] }) {
  if (awards.length === 0) return null;

  return (
    <Section>
      <Typo type="title-medium" color="BLACK">
        {title}
      </Typo>
      <AwardList>
        {awards.map((award) => (
          <AwardRow key={`${award.source_kind}:${award.source_slug}:${award.scheduled_survey_id}`}>
            <Layout.FlexCol gap={4}>
              <Typo type="body-medium" color="BLACK">
                {pickLocalized(award.title_en, award.title_ko)}
              </Typo>
              {award.note && (
                <Typo type="label-medium" color="DARK_GRAY">
                  {award.note}
                </Typo>
              )}
            </Layout.FlexCol>
            <AwardPoints award={award} />
          </AwardRow>
        ))}
      </AwardList>
    </Section>
  );
}

function actionText(row: LocalPreviewRow): string {
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

function PreviewRowBadges({ row }: { row: LocalPreviewRow }) {
  const { t } = useTranslation('translation', { keyPrefix: 'deadline_badge' });
  const displayPoints = currentPossiblePoints(row);

  return (
    <RowMeta>
      <MetaChip>{row.category}</MetaChip>
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
            </Layout.FlexCol>
            <PointsCell>
              <Typo type="title-medium" color="BLACK">
                {row.points} pts
              </Typo>
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
                {row.availability === 'late'
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

function Reimbursement() {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const previewUserId = useBoundStore((state) => state.myProfile?.id ?? null);
  const { data } = useSWR(
    REIMBURSEMENT_POINTS_TBU ? null : REIMBURSEMENT_KEY,
    getReimbursementState,
  );
  const { data: localPreview } = useSWR(
    shouldUseLocalAllocationPreview() ? [LOCAL_ALLOCATION_PREVIEW_KEY, previewUserId] : null,
    getLocalAllocationPreview,
  );

  if (REIMBURSEMENT_POINTS_TBU) {
    if (localPreview) return <LocalAllocationPreviewPage preview={localPreview} />;

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

  if (!data) return null;

  const surveyAwards = data.awards.filter((award) => award.source_kind === 'survey');
  const otherAwards = data.awards.filter((award) => award.source_kind !== 'survey');

  return (
    <MainScrollContainer>
      <SubHeader title={i18n.t('header.reimbursement')} />
      <Page aria-labelledby="reimbursement-title">
        <SummaryCard>
          <Typo type="label-large" color="PRIMARY">
            {t('summary_title')}
          </Typo>
          <SummaryNumber id="reimbursement-title">
            {data.adjusted_total} / {data.available_max} pts
          </SummaryNumber>
          <Typo type="title-medium" color="BLACK">
            {t('dollar_estimate_label', {
              amount: formatCurrency(data.dollar_estimate_cents),
            })}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {t('audit_disclaimer_long')}
          </Typo>
        </SummaryCard>

        <Section>
          <Typo type="title-medium" color="BLACK">
            {t('what_earns_title')}
          </Typo>
          <Typo type="body-medium" color="DARK_GRAY">
            {t('what_earns_body')}
          </Typo>
          <Typo type="label-large" color="PRIMARY">
            {t('conversion_rate', { points: data.points_per_dollar })}
          </Typo>
        </Section>

        <AwardGroup title={t('section_surveys')} awards={surveyAwards} />
        <AwardGroup title={t('section_other_activities')} awards={otherAwards} />

        {data.pending_prereqs.length > 0 && (
          <Section>
            <Typo type="title-medium" color="BLACK">
              {t('section_pending')}
            </Typo>
            {data.pending_prereqs.map((pending) => (
              <PendingRow key={`${pending.survey_slug}:${pending.scheduled_survey_id}`}>
                <Typo type="body-medium" color="BLACK">
                  {pickLocalized(pending.title_en, pending.title_ko)}
                </Typo>
                <Typo type="label-large" color="PRIMARY">
                  +{pending.potential_points} pts available
                </Typo>
                <Typo type="label-medium" color="DARK_GRAY">
                  {t('pending_prereq_copy', {
                    title: pickLocalized(pending.prereq_title_en, pending.prereq_title_ko),
                  })}
                </Typo>
              </PendingRow>
            ))}
          </Section>
        )}
      </Page>
    </MainScrollContainer>
  );
}

export default Reimbursement;
