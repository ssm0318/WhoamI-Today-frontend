import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { ReimbursementAward } from '@models/reimbursement';
import { getReimbursementState, REIMBURSEMENT_KEY } from '@utils/apis/reimbursement';

import { MainScrollContainer } from '../Root';

const Page = styled.main`
  min-height: calc(100dvh - 44px - 70px);
  margin-top: 44px;
  margin-bottom: 70px;
  padding: 20px;
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

const PointsCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
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

function Reimbursement() {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const { data } = useSWR(REIMBURSEMENT_KEY, getReimbursementState);

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
