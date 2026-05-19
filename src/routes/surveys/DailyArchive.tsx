import { KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import SubHeader from '@components/sub-header/SubHeader';
import LockedBadgeModal from '@components/survey/LockedBadgeModal';
import PointsBadge from '@components/survey/PointsBadge';
import { Colors, Typo } from '@design-system';
import i18n from '@i18n/index';
import { PastSurvey } from '@models/survey';
import { getPastSurveys } from '@utils/apis/survey';

import { MainScrollContainer } from '../Root';
import { SurveyPageShell } from './SurveyPageLayout';

const Page = styled(SurveyPageShell)`
  gap: 14px;
`;

const RowCard = styled.div`
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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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
  const location = useLocation();
  const { data } = useSWR('/surveys/past/', getPastSurveys);
  const [lockedRow, setLockedRow] = useState<PastSurvey | null>(null);

  const handleClick = (row: PastSurvey) => {
    if (row.user_answered) {
      navigate(`/surveys/${row.survey.slug}/results`);
    } else {
      // Pass `from` so the post-submit Done page returns the user to
      // the daily archive list, not the global surveys index.
      navigate(`/surveys/${row.survey.slug}/answer`, {
        state: { from: location.pathname + location.search },
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, row: PastSurvey) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleClick(row);
  };

  if (!data) return null;

  return (
    <MainScrollContainer>
      <SubHeader title={t('archive_title')} />
      <Page>
        {data.results.length === 0 && (
          <Typo type="body-medium" color="DARK_GRAY">
            {t('archive_empty')}
          </Typo>
        )}
        {data.results.map((row) => (
          <RowCard
            key={row.id}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(row)}
            onKeyDown={(event) => handleKeyDown(event, row)}
          >
            <Typo type="label-large" color="DARK_GRAY">
              {row.date}
            </Typo>
            <TitleRow>
              <Typo type="title-medium" color="BLACK">
                {pickLocalized(row.survey.title_en, row.survey.title_ko)}
              </Typo>
              <PointsBadge
                pointValue={row.survey.point_value}
                pointAward={row.survey.point_award}
                locked={!!row.survey.point_locked_by_prereq_slug}
                onLockedClick={
                  row.survey.point_locked_by_prereq_slug ? () => setLockedRow(row) : undefined
                }
              />
            </TitleRow>
            <StatusChip unanswered={!row.user_answered}>
              {row.user_answered ? t('answered_view_results') : t('answer_to_view_results')}
            </StatusChip>
          </RowCard>
        ))}
        {lockedRow && (
          <LockedBadgeModal
            visible
            pointValue={lockedRow.survey.point_value}
            prereqTitle={pickLocalized(
              lockedRow.survey.point_locked_by_prereq_title_en ??
                lockedRow.survey.point_locked_by_prereq_slug ??
                '',
              lockedRow.survey.point_locked_by_prereq_title_ko ??
                lockedRow.survey.point_locked_by_prereq_slug ??
                '',
            )}
            surveyTitle={pickLocalized(lockedRow.survey.title_en, lockedRow.survey.title_ko)}
            onClose={() => setLockedRow(null)}
            onDoPrereq={() => {
              const prereqSlug = lockedRow.survey.point_locked_by_prereq_slug;
              setLockedRow(null);
              if (prereqSlug) {
                navigate(`/surveys/${prereqSlug}/answer`, {
                  state: { from: location.pathname + location.search },
                });
              }
            }}
          />
        )}
      </Page>
    </MainScrollContainer>
  );
}

export default DailyArchive;
