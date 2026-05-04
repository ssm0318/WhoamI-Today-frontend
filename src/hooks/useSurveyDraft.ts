import { useCallback, useEffect, useState } from 'react';

import { useBoundStore } from '@stores/useBoundStore';

// Draft answer values mirror SurveyAnswerInput's value shape: numeric for
// likert / ordinal, string for categorical / free-text, list for multi-choice.
// `null` is reserved for the special likert_5_na N/A pick (LIKERT_NA_SENTINEL
// in the form is encoded as -1 and only converted to null at submit time;
// the draft type still allows null so other call sites can use it directly).
// The (number | string)[] variant covers ChoiceChips' multi-select output,
// where a single multi_choice question's answers are guaranteed to be of one
// type but the type system can't narrow that statically.
export type DraftAnswerValue = number | string | (number | string)[] | null;
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
