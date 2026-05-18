import type {
  DraftAnswers,
  DraftAnswerValue,
  PerFriendAnswerMap,
  ScalarAnswerValue,
} from '../../hooks/useSurveyDraft';
import { PER_FRIEND_QUESTION_TYPES, SurveyAnswerInput, SurveyQuestion } from '../../models/survey';

import { hasValue, isDisplayOnly } from './surveyPageResume';

const isPerFriendAnswerMapValue = (
  value: DraftAnswerValue | undefined,
): value is PerFriendAnswerMap =>
  value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);

const isScalarAnswerValue = (value: DraftAnswerValue | undefined): value is ScalarAnswerValue =>
  value !== undefined && !isPerFriendAnswerMapValue(value);

export function buildSurveyAnswerPayload(
  questions: SurveyQuestion[],
  answers: DraftAnswers,
): SurveyAnswerInput[] {
  const payload: SurveyAnswerInput[] = [];
  const serializedPerFriendQuestionIds = new Set<number>();

  questions.forEach((q) => {
    if (isDisplayOnly(q)) return;
    if (PER_FRIEND_QUESTION_TYPES.has(q.type)) {
      if (serializedPerFriendQuestionIds.has(q.id)) return;
      serializedPerFriendQuestionIds.add(q.id);
      const cell = answers[q.id];
      if (!isPerFriendAnswerMapValue(cell)) return;
      Object.entries(cell).forEach(([tidStr, value]) => {
        if (!hasValue(value)) return;
        payload.push({
          question_id: q.id,
          target_user_id: Number(tidStr),
          value,
        });
      });
      return;
    }

    const value = answers[q.id];
    if (!isScalarAnswerValue(value)) return;
    if (!hasValue(value)) return;
    payload.push({
      question_id: q.id,
      value,
    });
  });

  return payload;
}
