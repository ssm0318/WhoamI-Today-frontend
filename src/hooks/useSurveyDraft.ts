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
export type DraftAnswerValue = number | string | null | (number | string)[];

export type DraftAnswers = Record<number, DraftAnswerValue>;

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

  return { answers, setAnswer, clear, hydrated };
}
