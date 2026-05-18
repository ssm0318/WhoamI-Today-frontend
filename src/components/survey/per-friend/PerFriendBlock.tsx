import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Layout, Typo } from '@design-system';
import { DraftAnswers, isPerFriendAnswerMap, ScalarAnswerValue } from '@hooks/useSurveyDraft';
import { SurveyOptionValue, SurveyQuestion } from '@models/survey';

import { PerFriendCard } from './PerFriendCard';

const BlockList = styled(Layout.FlexCol)`
  width: 100%;
  gap: 12px;
`;

export interface PerFriendBlockProps {
  // All consecutive per_friend_* virtual questions for this page. The
  // backend expands in question-major order (all current first, then all
  // corrected_baseline, then all offline); this component re-groups them
  // by target_user_id so each friend appears once with all their inputs.
  questions: SurveyQuestion[];
  // The parent's full answer state for the survey. Keyed by question.id;
  // per-friend entries are nested maps from target_user_id → value.
  answers: DraftAnswers;
  setPerFriendAnswer: (questionId: number, targetUserId: number, value: ScalarAnswerValue) => void;
}

// Group the expanded per_friend questions by their target_user_id while
// preserving the source order both across friends (alphabetical, set by
// backend) and within each friend (question source order — current,
// corrected_baseline, offline). Friends without target_user_id (defensive,
// shouldn't happen) are skipped.
type FriendGroup = {
  friendId: number;
  friendUsername: string;
  baselineCloseness: number | null;
  baselineRelationshipType: string | null;
  questions: SurveyQuestion[];
};

function groupByFriend(questions: SurveyQuestion[]): FriendGroup[] {
  const groups: FriendGroup[] = [];
  const indexById = new Map<number, number>();
  questions.forEach((q) => {
    const tid = q.target_user_id;
    if (tid == null) return;
    let idx = indexById.get(tid);
    if (idx === undefined) {
      idx = groups.length;
      indexById.set(tid, idx);
      groups.push({
        friendId: tid,
        friendUsername: q.target_user_username ?? '',
        baselineCloseness: q.baseline_closeness ?? null,
        baselineRelationshipType: q.baseline_relationship_type ?? null,
        questions: [],
      });
    }
    groups[idx].questions.push(q);
  });
  return groups;
}

export function PerFriendBlock({ questions, answers, setPerFriendAnswer }: PerFriendBlockProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys.per_friend' });
  const friendGroups = useMemo(() => groupByFriend(questions), [questions]);

  if (friendGroups.length === 0) {
    // 0-friend edge case — the backend already drops per_friend questions
    // when the viewer has no friends, but render an empty-state message
    // here for defense in depth.
    return (
      <Layout.FlexCol w="100%" gap={8}>
        <Typo type="body-medium" color="DARK_GRAY">
          {t('empty_state')}
        </Typo>
      </Layout.FlexCol>
    );
  }

  const getValue = (questionId: number, targetUserId: number) => {
    const cell = answers[questionId];
    if (!isPerFriendAnswerMap(cell)) return undefined;
    return cell[String(targetUserId)] as SurveyOptionValue | null | undefined;
  };

  return (
    <BlockList>
      {friendGroups.map((g) => (
        <PerFriendCard
          key={g.friendId}
          friendId={g.friendId}
          friendUsername={g.friendUsername}
          baselineCloseness={g.baselineCloseness}
          baselineRelationshipType={g.baselineRelationshipType}
          questions={g.questions}
          getValue={(qid) => getValue(qid, g.friendId)}
          setValue={(qid, value) => setPerFriendAnswer(qid, g.friendId, value)}
        />
      ))}
    </BlockList>
  );
}

// Predicate exported so SurveyAnswerForm can decide page-completion
// readiness. A block is complete when every required question for every
// friend has a value (or, for the corrected_baseline question on a
// friend with no baseline, that question is hidden and thus auto-complete).
// Single-pair complete check. Pulled out as a top-level helper so the
// nested .every() below stays readable (and ESLint stops complaining
// about `continue` in for…of).
function isFriendQuestionAnswered(
  q: SurveyQuestion,
  group: FriendGroup,
  answers: DraftAnswers,
): boolean {
  if (!q.required) return true;
  const hasBaseline = group.baselineCloseness !== null;
  if (q.slug.endsWith('_corrected_baseline') && !hasBaseline) return true;
  const cell = answers[q.id];
  if (!isPerFriendAnswerMap(cell)) return false;
  const v = cell[String(group.friendId)];
  if (v === undefined) return false;
  if (typeof v === 'string' && v.trim().length === 0) return false;
  if (Array.isArray(v) && v.length === 0) return false;
  return true;
}

export function isPerFriendBlockComplete(
  questions: SurveyQuestion[],
  answers: DraftAnswers,
): boolean {
  const friendGroups = groupByFriend(questions);
  return friendGroups.every((g) =>
    g.questions.every((q) => isFriendQuestionAnswered(q, g, answers)),
  );
}
