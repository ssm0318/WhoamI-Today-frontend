import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import i18n from '@i18n/index';
import { SurveyOptionValue, SurveyQuestion } from '@models/survey';

import { ChoiceChips } from '../ChoiceChips';
import { LikertChips } from '../LikertChips';

const pickLocalized = (en: string, ko: string) => (i18n.language === 'ko' ? ko : en);

const Card = styled(Layout.FlexCol)`
  width: 100%;
  padding: 12px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  gap: 12px;
`;

const FriendLink = styled(Link)`
  color: ${Colors.PRIMARY};
  font-weight: 600;
  text-decoration: none;
  &:visited {
    color: ${Colors.PRIMARY};
  }
`;

const BaselineRow = styled(Layout.FlexRow)`
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 10px;
  background: ${Colors.LIGHT};
  border-radius: 8px;
`;

const QuestionBlock = styled(Layout.FlexCol)`
  gap: 6px;
`;

const QuestionPrompt = styled(Typo)`
  /* Slightly tighter than the standalone-question prompt so each friend
     card stays compact on small screens. */
`;

export interface PerFriendCardProps {
  friendId: number;
  friendUsername: string;
  baselineCloseness: number | null;
  baselineRelationshipType: string | null;
  // Questions for THIS friend, in source order. Each one is a virtual
  // expansion of a PER_FRIEND_QUESTION_TYPES source row.
  questions: SurveyQuestion[];
  // Current value for (questionId, friendId). Returns undefined if untouched.
  getValue: (questionId: number) => SurveyOptionValue | null | undefined;
  setValue: (questionId: number, value: SurveyOptionValue | null) => void;
}

const LIKERT_RANGES: Record<string, [number, number]> = {
  per_friend_likert_5: [1, 5],
};

export function PerFriendCard({
  friendId,
  friendUsername,
  baselineCloseness,
  baselineRelationshipType,
  questions,
  getValue,
  setValue,
}: PerFriendCardProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys.per_friend' });
  const hasBaseline = baselineCloseness !== null;

  return (
    <Card data-friend-id={friendId}>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="title-medium" color="BLACK">
          <FriendLink to={`/users/${friendUsername}`}>@{friendUsername}</FriendLink>
        </Typo>
      </Layout.FlexRow>

      {hasBaseline && (
        <BaselineRow>
          <Typo type="label-medium" color="DARK_GRAY">
            {t('baseline_label')}
          </Typo>
          <Typo type="label-medium" color="BLACK">
            {t('baseline_closeness_value', { value: baselineCloseness })}
          </Typo>
          {baselineRelationshipType && (
            <Typo type="label-medium" color="DARK_GRAY">
              · {t(`relationship_type.${baselineRelationshipType}`, baselineRelationshipType)}
            </Typo>
          )}
        </BaselineRow>
      )}

      {questions.map((q) => {
        // Hide the corrected_baseline question if there's no baseline to
        // correct — its prompt references {{baseline_closeness}} which is
        // meaningless otherwise.
        const isBaselineCorrection = q.slug.endsWith('_corrected_baseline');
        if (isBaselineCorrection && !hasBaseline) return null;
        const value = getValue(q.id);
        return (
          <QuestionBlock key={q.id}>
            <QuestionPrompt type="body-medium" color="BLACK">
              {pickLocalized(q.prompt_en, q.prompt_ko)}
            </QuestionPrompt>
            {q.type === 'per_friend_likert_5' && (
              <LikertChips
                min={LIKERT_RANGES.per_friend_likert_5[0]}
                max={LIKERT_RANGES.per_friend_likert_5[1]}
                selected={value as number | null | undefined}
                onSelect={(v) => setValue(q.id, v ?? null)}
                lowLabel={pickLocalized(q.low_label_en, q.low_label_ko)}
                highLabel={pickLocalized(q.high_label_en, q.high_label_ko)}
              />
            )}
            {q.type === 'per_friend_single_choice' && (
              <ChoiceChips
                options={q.options.map((o) => ({
                  value: o.value,
                  label: pickLocalized(o.label_en, o.label_ko),
                }))}
                multi={false}
                selected={(value as SurveyOptionValue | null | undefined) ?? null}
                onSelect={(v) => setValue(q.id, v as SurveyOptionValue)}
              />
            )}
          </QuestionBlock>
        );
      })}
    </Card>
  );
}
