import { useCallback, useEffect, useState } from 'react';

import { useBoundStore } from '@stores/useBoundStore';

// Answer value mirrors backend SurveyAnswer.value (JSONField). single_choice
// / multi_choice may carry either numbers (likert codes) or strings
// (category codes like "mission_suggest"); free_text is string; likert
// is number; multi_choice is the array form. `null` is the NA_SENTINEL
// on likert_5_na — a valid recorded answer meaning "not applicable",
// distinct from `undefined` which means "user hasn't engaged with this
// question yet". Array form widened to (number | string)[] because a
// single multi_choice question may receive SurveyOptionValue[] from
// ChoiceChips, and array variance forbids `number[] | string[]` from
// accepting `(number | string)[]`.
export type ScalarAnswerValue = number | string | null | (number | string)[];

// For PER_FRIEND_QUESTION_TYPES: one map from target_user_id → scalar
// answer. A single SurveyQuestion.id then covers N rows in the submit
// payload (one per friend). Keys are stringified user IDs so the whole
// shape JSON-serializes for localStorage round-trip.
export type PerFriendAnswerMap = Record<string, ScalarAnswerValue>;

export type DraftAnswerValue = ScalarAnswerValue | PerFriendAnswerMap;

export type DraftAnswers = Record<number, DraftAnswerValue>;

export const isPerFriendAnswerMap = (
  value: DraftAnswerValue | undefined,
): value is PerFriendAnswerMap =>
  value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);

interface DraftPayload {
  answers: DraftAnswers;
  savedAt: string;
}

const KEY_PREFIX = 'whoami_survey_draft_';

const buildKey = (userId: number | null, slug: string) =>
  `${KEY_PREFIX}${userId ?? 'anon'}_${slug}`;

const readDraft = (key: string): DraftAnswers => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DraftPayload;
    return parsed.answers ?? {};
  } catch {
    return {};
  }
};

const writeDraft = (key: string, answers: DraftAnswers) => {
  try {
    const payload: DraftPayload = { answers, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable (private mode, quota); fail silently
  }
};

export function useSurveyDraft(slug: string | undefined) {
  const userId = useBoundStore((s) => s.myProfile?.id ?? null);
  const key = slug ? buildKey(userId, slug) : null;

  const [answers, setAnswers] = useState<DraftAnswers>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!key) return;
    setAnswers(readDraft(key));
    setHydrated(true);
  }, [key]);

  const setAnswer = useCallback(
    (questionId: number, value: DraftAnswerValue) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        if (key) writeDraft(key, next);
        return next;
      });
    },
    [key],
  );

  // Merge-update a single (questionId, targetUserId) cell without rebuilding
  // the whole per-friend map. Used by per_friend_* question renderers where
  // each row mutates one friend's answer independently. Auto-saves to the
  // same draft localStorage entry as setAnswer.
  const setPerFriendAnswer = useCallback(
    (questionId: number, targetUserId: number, value: ScalarAnswerValue) => {
      setAnswers((prev) => {
        const existing = prev[questionId];
        const baseMap: PerFriendAnswerMap = isPerFriendAnswerMap(existing) ? existing : {};
        const merged: PerFriendAnswerMap = { ...baseMap, [String(targetUserId)]: value };
        const next = { ...prev, [questionId]: merged };
        if (key) writeDraft(key, next);
        return next;
      });
    },
    [key],
  );

  const clear = useCallback(() => {
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    setAnswers({});
  }, [key]);

  return { answers, setAnswer, setPerFriendAnswer, clear, hydrated };
}
