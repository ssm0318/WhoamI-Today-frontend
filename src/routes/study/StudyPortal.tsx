import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import PointsBadge from '@components/survey/PointsBadge';
import { Colors } from '@design-system';
import i18n from '@i18n/index';
import { ReimbursementAward } from '@models/reimbursement';
import { SurveyIndexEntry } from '@models/survey';
import { getReimbursementState, REIMBURSEMENT_KEY } from '@utils/apis/reimbursement';
import { getSurveyIndex } from '@utils/apis/survey';

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const formatDate = (value: string | null): string => {
  if (!value) return 'Open';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const formatMoney = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

const getActionLabel = (entry: SurveyIndexEntry): string => {
  if (entry.draft && entry.draft.progress_pct > 0) return 'Continue';
  if (entry.bucket === 'completed') {
    if (entry.survey.editable && !entry.survey.closed) return 'Edit';
    return 'View';
  }
  return 'Start';
};

const sortTodo = (entries: SurveyIndexEntry[]) =>
  [...entries].sort((a, b) => {
    const bPoints = b.point_award?.effective_points ?? b.point_value;
    const aPoints = a.point_award?.effective_points ?? a.point_value;
    if (bPoints !== aPoints) return bPoints - aPoints;
    return a.sequence_index - b.sequence_index;
  });

const groupRecentAwards = (awards: ReimbursementAward[]) =>
  [...awards]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 8);

function StudyPortal() {
  const { data: surveyIndex } = useSWR('/surveys/index/', getSurveyIndex);
  const { data: reimbursement } = useSWR(REIMBURSEMENT_KEY, getReimbursementState);

  if (!surveyIndex || !reimbursement) {
    return (
      <PageShell>
        <LoadingPanel>Loading your study dashboard...</LoadingPanel>
      </PageShell>
    );
  }

  const todo = sortTodo([...surveyIndex.available_now, ...surveyIndex.late_but_accepted]);
  const { completed } = surveyIndex;
  const [nextTodo] = todo;
  const recentAwards = groupRecentAwards(reimbursement.awards);
  const hasPendingPrereqs = reimbursement.pending_prereqs.length > 0;

  return (
    <PageShell>
      <TopBar>
        <BrandLockup>
          <LogoMark>W</LogoMark>
          <div>
            <Eyebrow>WhoAmI Today</Eyebrow>
            <Title>Study dashboard</Title>
          </div>
        </BrandLockup>
        <TopLinks>
          <TopLink to="/surveys">Mobile survey view</TopLink>
          <TopLink to="/reimbursement">Reimbursement page</TopLink>
        </TopLinks>
      </TopBar>

      <HeroGrid>
        <SummaryPanel>
          <PanelLabel>Your study points</PanelLabel>
          <PointTotal>
            {reimbursement.adjusted_total} / {reimbursement.available_max} pts
          </PointTotal>
          <Estimate>~{formatMoney(reimbursement.dollar_estimate_cents)} estimated</Estimate>
          <Disclaimer>
            Points are provisional and may change after the study-end data-quality review.
          </Disclaimer>
        </SummaryPanel>

        <QuickPanel>
          <PanelLabel>What to focus on</PanelLabel>
          <QuickMetric>
            <strong>{todo.length}</strong>
            <span>open or late surveys</span>
          </QuickMetric>
          <QuickMetric>
            <strong>{completed.length}</strong>
            <span>completed survey items</span>
          </QuickMetric>
          <PrimaryLink to={nextTodo?.redirect_url ?? '/surveys'} state={{ from: '/study' }}>
            {todo.length > 0 ? 'Start next survey' : 'Open surveys'}
          </PrimaryLink>
        </QuickPanel>
      </HeroGrid>

      <ContentGrid>
        <MainColumn>
          <SectionHeader>
            <h2>To do now</h2>
            <span>{todo.length} available</span>
          </SectionHeader>
          {todo.length > 0 ? (
            <CardList>
              {todo.map((entry) => (
                <SurveyCard key={entry.id} $late={entry.bucket === 'late_but_accepted'}>
                  <CardMain>
                    <CardTitle>
                      {pickLocalized(entry.survey.title_en, entry.survey.title_ko)}
                    </CardTitle>
                    <MetaLine>
                      <span>{entry.cadence}</span>
                      <span>Due {formatDate(entry.window_end)}</span>
                      {entry.bucket === 'late_but_accepted' && <LateLabel>Late accepted</LateLabel>}
                      {entry.draft && entry.draft.progress_pct > 0 && (
                        <DraftLabel>{entry.draft.progress_pct}% saved</DraftLabel>
                      )}
                    </MetaLine>
                  </CardMain>
                  <CardAside>
                    <PointsBadge
                      pointValue={entry.point_value}
                      pointAward={entry.point_award}
                      locked={!!entry.point_locked_by_prereq_slug}
                    />
                    <ActionLink to={entry.redirect_url} state={{ from: '/study' }}>
                      {getActionLabel(entry)}
                    </ActionLink>
                  </CardAside>
                </SurveyCard>
              ))}
            </CardList>
          ) : (
            <EmptyPanel>No surveys are available right now.</EmptyPanel>
          )}

          {hasPendingPrereqs && (
            <>
              <SectionHeader>
                <h2>Blocked until another survey is done</h2>
                <span>{reimbursement.pending_prereqs.length} item(s)</span>
              </SectionHeader>
              <CardList>
                {reimbursement.pending_prereqs.map((item) => (
                  <PendingCard key={`${item.survey_slug}-${item.scheduled_survey_id ?? 'open'}`}>
                    <CardMain>
                      <CardTitle>{pickLocalized(item.title_en, item.title_ko)}</CardTitle>
                      <MetaLine>
                        <span>+{item.potential_points} pts available</span>
                        <span>
                          Complete {pickLocalized(item.prereq_title_en, item.prereq_title_ko)} first
                        </span>
                      </MetaLine>
                    </CardMain>
                    <ActionLink
                      to={`/surveys/${item.prereq_slug}/answer`}
                      state={{ from: '/study' }}
                    >
                      Do prerequisite
                    </ActionLink>
                  </PendingCard>
                ))}
              </CardList>
            </>
          )}
        </MainColumn>

        <SideColumn>
          <SectionHeader>
            <h2>Completed</h2>
            <span>{completed.length}</span>
          </SectionHeader>
          <CompactList>
            {completed.slice(0, 10).map((entry) => (
              <CompactRow key={entry.id}>
                <div>
                  <CompactTitle>
                    {pickLocalized(entry.survey.title_en, entry.survey.title_ko)}
                  </CompactTitle>
                  <CompactMeta>{entry.submitted_at ? 'Submitted' : 'Completed'}</CompactMeta>
                </div>
                <PointsBadge pointValue={entry.point_value} pointAward={entry.point_award} />
              </CompactRow>
            ))}
            {completed.length === 0 && <EmptyCompact>No completed surveys yet.</EmptyCompact>}
          </CompactList>

          <SectionHeader>
            <h2>Recent points</h2>
            <span>{recentAwards.length}</span>
          </SectionHeader>
          <CompactList>
            {recentAwards.map((award) => (
              <CompactRow key={`${award.source_kind}-${award.source_slug}-${award.submitted_at}`}>
                <div>
                  <CompactTitle>{pickLocalized(award.title_en, award.title_ko)}</CompactTitle>
                  <CompactMeta>{award.source_kind.replace(/_/g, ' ')}</CompactMeta>
                </div>
                <AwardPoints>+{award.effective_points} pts</AwardPoints>
              </CompactRow>
            ))}
            {recentAwards.length === 0 && <EmptyCompact>No points credited yet.</EmptyCompact>}
          </CompactList>
        </SideColumn>
      </ContentGrid>
    </PageShell>
  );
}

const PageShell = styled.main`
  min-height: 100vh;
  background: #f7f5f1;
  color: ${Colors.BLACK};
  padding: 28px clamp(18px, 4vw, 56px) 56px;
`;

const TopBar = styled.header`
  max-width: 1180px;
  margin: 0 auto 28px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const BrandLockup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoMark = styled.div`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: ${Colors.BLACK};
  color: ${Colors.WHITE};
  font-weight: 800;
  font-size: 20px;
`;

const Eyebrow = styled.div`
  color: ${Colors.DARK_GRAY};
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 2px 0 0;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1;
`;

const TopLinks = styled.nav`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TopLink = styled(Link)`
  color: ${Colors.BLACK};
  border: 1px solid #d6d0c7;
  border-radius: 999px;
  padding: 10px 14px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.72);
`;

const HeroGrid = styled.section`
  max-width: 1180px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.8fr);
  gap: 18px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryPanel = styled.section`
  border: 1px solid #dac8ff;
  background: linear-gradient(135deg, #fff 0%, #f4ecff 100%);
  border-radius: 18px;
  padding: clamp(24px, 4vw, 42px);
`;

const QuickPanel = styled.section`
  border: 1px solid #ded7ce;
  background: #fffdf8;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PanelLabel = styled.div`
  color: #8700ff;
  font-size: 16px;
  font-weight: 800;
`;

const PointTotal = styled.div`
  margin-top: 18px;
  font-size: clamp(44px, 7vw, 76px);
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: 0;
  white-space: nowrap;

  @media (max-width: 380px) {
    font-size: clamp(36px, 12vw, 44px);
  }
`;

const Estimate = styled.div`
  margin-top: 16px;
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 700;
`;

const Disclaimer = styled.p`
  max-width: 680px;
  margin: 18px 0 0;
  color: #5f5b66;
  font-size: 17px;
  line-height: 1.45;
`;

const QuickMetric = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;

  strong {
    font-size: 34px;
  }

  span {
    color: ${Colors.DARK_GRAY};
    font-size: 15px;
  }
`;

const PrimaryLink = styled(Link)`
  margin-top: auto;
  display: inline-flex;
  justify-content: center;
  border-radius: 12px;
  padding: 13px 16px;
  background: #8700ff;
  color: white;
  text-decoration: none;
  font-weight: 800;
`;

const ContentGrid = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.8fr);
  gap: 22px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  min-width: 0;
`;

const SideColumn = styled.aside`
  min-width: 0;
`;

const SectionHeader = styled.div`
  margin: 24px 0 12px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;

  h2 {
    margin: 0;
    font-size: 24px;
    line-height: 1.1;
  }

  span {
    color: ${Colors.DARK_GRAY};
    font-size: 14px;
    font-weight: 700;
  }
`;

const CardList = styled.div`
  display: grid;
  gap: 12px;
`;

const SurveyCard = styled.article<{ $late?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid ${({ $late }) => ($late ? '#e2b96c' : '#ded7ce')};
  background: ${({ $late }) => ($late ? '#fffaf0' : '#ffffff')};
  border-radius: 14px;
  padding: 18px;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const PendingCard = styled(SurveyCard).attrs({ as: 'article' })`
  border-style: dashed;
`;

const CardMain = styled.div`
  min-width: 0;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
`;

const MetaLine = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  color: ${Colors.DARK_GRAY};
  font-size: 13px;
  font-weight: 650;
`;

const LateLabel = styled.span`
  color: #9a5a00;
`;

const DraftLabel = styled.span`
  color: #227447;
`;

const CardAside = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid ${Colors.BLACK};
  padding: 9px 14px;
  color: ${Colors.BLACK};
  background: ${Colors.WHITE};
  text-decoration: none;
  font-weight: 800;
  min-width: 82px;
`;

const CompactList = styled.div`
  border: 1px solid #ded7ce;
  border-radius: 14px;
  background: ${Colors.WHITE};
  overflow: hidden;
`;

const CompactRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;

  & + & {
    border-top: 1px solid #ece6dd;
  }
`;

const CompactTitle = styled.div`
  font-weight: 800;
  line-height: 1.25;
`;

const CompactMeta = styled.div`
  margin-top: 3px;
  color: ${Colors.DARK_GRAY};
  font-size: 12px;
  text-transform: capitalize;
`;

const AwardPoints = styled.div`
  color: #227447;
  font-weight: 900;
  white-space: nowrap;
`;

const EmptyPanel = styled.div`
  border: 1px dashed #cfc7bc;
  border-radius: 14px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.68);
  color: ${Colors.DARK_GRAY};
`;

const EmptyCompact = styled.div`
  padding: 16px;
  color: ${Colors.DARK_GRAY};
`;

const LoadingPanel = styled.div`
  max-width: 720px;
  margin: 120px auto 0;
  border-radius: 18px;
  padding: 32px;
  background: ${Colors.WHITE};
  border: 1px solid #ded7ce;
  font-size: 18px;
  font-weight: 700;
`;

export default StudyPortal;
