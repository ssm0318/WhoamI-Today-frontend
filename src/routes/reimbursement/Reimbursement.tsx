import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import { Colors } from '@design-system';
import i18n from '@i18n/index';
import { ReimbursementAward, ReimbursementState } from '@models/reimbursement';
import { getReimbursementState, REIMBURSEMENT_KEY } from '@utils/apis/reimbursement';

import { MainScrollContainer } from '../Root';

const Page = styled.main`
  min-height: 100%;
  padding: 16px 20px 140px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: ${Colors.WHITE};

  > * {
    flex-shrink: 0;
  }

  @media (max-width: 340px) {
    padding-inline: 14px;
  }
`;

const FinalCard = styled.section`
  position: relative;
  overflow: hidden;
  border: 1px solid #d8c3ff;
  border-radius: 12px;
  background: linear-gradient(145deg, #fbf8ff 0%, #f4ecff 100%);
  padding: 22px 20px 20px;
`;

const FinalStamp = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid #8700ff;
  border-radius: 999px;
  color: #6c00ca;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
`;

const SummaryLabel = styled.p`
  margin: 18px 0 0;
  color: #5b5363;
  font-size: 13px;
  font-weight: 700;
`;

const PointTotal = styled.h1`
  margin: 4px 0 0;
  color: #201927;
  font-size: clamp(38px, 12vw, 52px);
  font-weight: 850;
  letter-spacing: -0.045em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

const DollarTotal = styled.p`
  margin: 10px 0 0;
  color: #201927;
  font-size: 18px;
  font-weight: 750;
`;

const Conversion = styled.p`
  margin: 4px 0 0;
  color: #6f6676;
  font-size: 12px;
  font-weight: 600;
`;

const RoundingNotice = styled.p`
  margin: 7px 0 0;
  color: #7d7484;
  font-size: 10px;
  font-weight: 550;
  line-height: 1.4;
`;

const PolicyCard = styled.aside`
  border-left: 4px solid #d49a00;
  border-radius: 4px 10px 10px 4px;
  background: #fff8e2;
  color: #4f411d;
  padding: 13px 14px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #201927;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

const Ledger = styled.div`
  overflow: hidden;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 10px;
  background: ${Colors.WHITE};
`;

const LedgerRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  padding: 14px;

  & + & {
    border-top: 1px solid ${Colors.LIGHT_GRAY};
  }
`;

const AwardTitle = styled.h3`
  margin: 0;
  color: #201927;
  font-size: 14px;
  font-weight: 750;
  line-height: 1.35;
`;

const AwardNote = styled.p`
  margin: 5px 0 0;
  color: ${Colors.DARK_GRAY};
  font-size: 12px;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

const PointStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  white-space: nowrap;
`;

const AwardPoints = styled.strong<{ $zero?: boolean }>`
  color: ${({ $zero }) => ($zero ? '#6f6676' : '#2f6b4f')};
  font-size: 15px;
  font-variant-numeric: tabular-nums;
`;

const OriginalPoints = styled.s`
  color: #8a818f;
  font-size: 11px;
  font-weight: 650;
`;

const ReviewedLabel = styled.span`
  color: #8b6100;
  font-size: 10px;
  font-weight: 750;
`;

const EmptyCard = styled.div`
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 10px;
  background: #fafafa;
  color: ${Colors.DARK_GRAY};
  padding: 14px;
  font-size: 13px;
  line-height: 1.45;
`;

const InterviewCard = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  border: 1px solid #c8e1d4;
  border-radius: 12px;
  background: #f2faf6;
  padding: 16px;

  @media (max-width: 340px) {
    grid-template-columns: 1fr;
  }
`;

const InterviewTitle = styled.h2`
  margin: 0;
  color: #193b2b;
  font-size: 16px;
  font-weight: 800;
`;

const InterviewBody = styled.p`
  margin: 5px 0 0;
  color: #355c49;
  font-size: 12px;
  line-height: 1.45;
`;

const InterviewDeadline = styled.p`
  margin: 4px 0 0;
  color: #355c49;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.45;
`;

const InterviewLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: 8px;
  background: #6f00d2;
  color: ${Colors.WHITE};
  padding: 9px 13px;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;

  &:focus-visible {
    outline: 3px solid #d8c3ff;
    outline-offset: 2px;
  }
`;

const DropoutCard = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  border: 1px solid #ded0ee;
  border-radius: 12px;
  background: #faf7fd;
  padding: 16px;

  @media (max-width: 340px) {
    grid-template-columns: 1fr;
  }
`;

const DropoutTitle = styled.h2`
  margin: 0;
  color: #30253a;
  font-size: 16px;
  font-weight: 800;
`;

const DropoutBody = styled.p`
  margin: 5px 0 0;
  color: #62566d;
  font-size: 12px;
  line-height: 1.45;
`;

const DropoutLink = styled(InterviewLink)`
  background: #5c5264;
`;

const DropoutCompleted = styled.span`
  color: #2f6b4f;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
`;

const LoadingCard = styled.div`
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 10px;
  color: ${Colors.DARK_GRAY};
  padding: 18px;
  font-size: 14px;
`;

const pickLocalized = (award: ReimbursementAward) =>
  i18n.language === 'ko' ? award.title_ko : award.title_en;

const formatCurrency = (cents: number) => (cents / 100).toFixed(2);

function AwardRows({ awards }: { awards: ReimbursementAward[] }) {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });

  return (
    <Ledger>
      {awards.map((award) => {
        const adjusted =
          award.adjusted_points !== null && award.adjusted_points !== award.awarded_points;
        return (
          <LedgerRow
            key={`${award.source_kind}:${award.source_slug}:${
              award.scheduled_survey_id ?? award.submitted_at
            }`}
          >
            <div>
              <AwardTitle>{pickLocalized(award)}</AwardTitle>
              {award.note && <AwardNote>{award.note}</AwardNote>}
            </div>
            <PointStack>
              <AwardPoints $zero={award.effective_points === 0}>
                {award.effective_points} pts
              </AwardPoints>
              {adjusted && <OriginalPoints>{award.awarded_points} pts</OriginalPoints>}
              {adjusted && <ReviewedLabel>{t('adjusted_label')}</ReviewedLabel>}
            </PointStack>
          </LedgerRow>
        );
      })}
    </Ledger>
  );
}

function FinalReimbursementPage({ data }: { data: ReimbursementState }) {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const credited = data.awards.filter((award) => award.effective_points > 0);
  const notCredited = data.awards.filter((award) => award.effective_points === 0);
  const interview = data.interview_opportunity;

  return (
    <MainScrollContainer>
      <SubHeader title={i18n.t('header.reimbursement')} />
      <Page aria-labelledby="reimbursement-title">
        <FinalCard data-testid="final-summary">
          <FinalStamp>{t('final_eyebrow')}</FinalStamp>
          <SummaryLabel>{t('final_points_label')}</SummaryLabel>
          <PointTotal id="reimbursement-title">{data.adjusted_total} pts</PointTotal>
          <DollarTotal>
            {t('dollar_total_label', { amount: formatCurrency(data.dollar_estimate_cents) })}
          </DollarTotal>
          <Conversion>{t('conversion_rate', { points: data.points_per_dollar })}</Conversion>
          <RoundingNotice>{t('rounding_notice')}</RoundingNotice>
        </FinalCard>

        <PolicyCard>{t('policy_notice')}</PolicyCard>

        {interview && !interview.completed && interview.signup_url && (
          <InterviewCard>
            <div>
              <InterviewTitle>{t('interview_title')}</InterviewTitle>
              <InterviewBody>
                {t('interview_body', { points: interview.potential_points })}
              </InterviewBody>
              <InterviewDeadline>{t('interview_deadline')}</InterviewDeadline>
            </div>
            <InterviewLink href={interview.signup_url} target="_blank" rel="noreferrer">
              {t('interview_action')}
            </InterviewLink>
          </InterviewCard>
        )}

        {data.dropout_survey && (
          <DropoutCard>
            <div>
              <DropoutTitle>{t('dropout_title')}</DropoutTitle>
              <DropoutBody>
                {t('dropout_body', {
                  points: data.dropout_survey.potential_points,
                  dollars: data.dropout_survey.potential_dollar_cents / 100,
                })}
              </DropoutBody>
            </div>
            {data.dropout_survey.completed || !data.dropout_survey.url ? (
              <DropoutCompleted>{t('dropout_completed')}</DropoutCompleted>
            ) : (
              <DropoutLink href={data.dropout_survey.url} target="_blank" rel="noreferrer">
                {t('dropout_action')}
              </DropoutLink>
            )}
          </DropoutCard>
        )}

        <Section>
          <SectionTitle>{t('credited_title')}</SectionTitle>
          {credited.length > 0 ? (
            <AwardRows awards={credited} />
          ) : (
            <EmptyCard>{t('empty_credited')}</EmptyCard>
          )}
        </Section>

        {notCredited.length > 0 && (
          <Section>
            <SectionTitle>{t('not_credited_title')}</SectionTitle>
            <AwardRows awards={notCredited} />
          </Section>
        )}
      </Page>
    </MainScrollContainer>
  );
}

function Reimbursement() {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });
  const { data } = useSWR(REIMBURSEMENT_KEY, getReimbursementState);

  if (!data) {
    return (
      <MainScrollContainer>
        <SubHeader title={i18n.t('header.reimbursement')} />
        <Page aria-labelledby="reimbursement-title">
          <LoadingCard id="reimbursement-title">{t('loading')}</LoadingCard>
        </Page>
      </MainScrollContainer>
    );
  }

  return <FinalReimbursementPage data={data} />;
}

export default Reimbursement;
