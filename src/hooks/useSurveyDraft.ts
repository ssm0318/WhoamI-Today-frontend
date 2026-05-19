import { useCallback, useEffect, useRef, useState } from 'react';

import type { SurveyDraft } from '@models/survey';
import { useBoundStore } from '@stores/useBoundStore';
import { putSurveyDraftKeepalive, type SurveyDraftBackupPayload } from '@utils/apis/survey';

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
  currentPageIndex: number;
  totalPages: number;
  answeredPages: number;
  progressPct: number;
  savedAt: string;
}

interface DraftProgressMetadata {
  currentPageIndex: number;
  totalPages: number;
  answeredPages: number;
  progressPct: number;
}

const KEY_PREFIX = 'whoami_survey_draft_';

const buildKey = (userId: number | null, slug: string) =>
  `${KEY_PREFIX}${userId ?? 'anon'}_${slug}`;

const emptyDraft = (): DraftPayload => ({
  answers: {},
  currentPageIndex: 0,
  totalPages: 0,
  answeredPages: 0,
  progressPct: 0,
  savedAt: '',
});

const numberOrZero = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const normalizeLocalPayload = (parsed: Partial<DraftPayload> | null): DraftPayload => ({
  answers: (parsed?.answers ?? {}) as DraftAnswers,
  currentPageIndex: numberOrZero(parsed?.currentPageIndex),
  totalPages: numberOrZero(parsed?.totalPages),
  answeredPages: numberOrZero(parsed?.answeredPages),
  progressPct: numberOrZero(parsed?.progressPct),
  savedAt: typeof parsed?.savedAt === 'string' ? parsed.savedAt : '',
});

const normalizeBackendDraft = (draft: SurveyDraft | null | undefined): DraftPayload | null => {
  if (!draft) return null;
  return {
    answers: draft.answers as DraftAnswers,
    currentPageIndex: draft.current_page_index,
    totalPages: draft.total_pages,
    answeredPages: draft.answered_pages,
    progressPct: draft.progress_pct,
    savedAt: draft.saved_at,
  };
};

const timestamp = (value: string): number => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const mergeDraftPayloads = (
  localDraft: DraftPayload | null,
  backendDraft: SurveyDraft | null | undefined,
): DraftPayload => {
  const local = localDraft ?? emptyDraft();
  const backend = normalizeBackendDraft(backendDraft);
  if (!backend) return local;
  if (timestamp(backend.savedAt) >= timestamp(local.savedAt)) return backend;
  return local;
};

export const readSurveyDraftPayload = (key: string): DraftPayload => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as Partial<DraftPayload>;
    return normalizeLocalPayload(parsed);
  } catch {
    return emptyDraft();
  }
};

export const writeSurveyDraftPayload = (key: string, payload: DraftPayload) => {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable (private mode, quota); fail silently
  }
};

const hasScalarContent = (value: ScalarAnswerValue | undefined): boolean => {
  if (value === undefined) return false;
  if (value === null) return true;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const hasDraftContent = (draft: DraftPayload): boolean =>
  Object.values(draft.answers).some((value) => {
    if (isPerFriendAnswerMap(value)) return Object.values(value).some(hasScalarContent);
    return hasScalarContent(value);
  });

const toBackupPayload = (draft: DraftPayload): SurveyDraftBackupPayload => ({
  answers: draft.answers,
  current_page_index: draft.currentPageIndex,
  total_pages: draft.totalPages,
  answered_pages: draft.answeredPages,
  progress_pct: draft.progressPct,
});

const contentHash = (draft: DraftPayload): string => JSON.stringify(toBackupPayload(draft));

export function useSurveyDraft(slug: string | undefined, backendDraft?: SurveyDraft | null) {
  const userId = useBoundStore((s) => s.myProfile?.id ?? null);
  const key = slug ? buildKey(userId, slug) : null;

  const [answers, setAnswers] = useState<DraftAnswers>({});
  const [metadata, setMetadata] = useState<DraftProgressMetadata>({
    currentPageIndex: 0,
    totalPages: 0,
    answeredPages: 0,
    progressPct: 0,
  });
  const [hydrated, setHydrated] = useState(false);
  const latestDraftRef = useRef<DraftPayload>(emptyDraft());
  const lastBackedUpHashRef = useRef<string | null>(null);
  const backupDisabledRef = useRef(false);

  const persist = useCallback(
    (next: DraftPayload) => {
      latestDraftRef.current = next;
      setAnswers(next.answers);
      setMetadata({
        currentPageIndex: next.currentPageIndex,
        totalPages: next.totalPages,
        answeredPages: next.answeredPages,
        progressPct: next.progressPct,
      });
      if (key) writeSurveyDraftPayload(key, next);
    },
    [key],
  );

  useEffect(() => {
    if (!key) return;
    backupDisabledRef.current = false;
    const local = readSurveyDraftPayload(key);
    const merged = mergeDraftPayloads(local, backendDraft);
    const backendPayload = normalizeBackendDraft(backendDraft);
    const localHasPayload = Boolean(local.savedAt) || hasDraftContent(local);
    const selectedBackend =
      backendPayload !== null &&
      (!localHasPayload || timestamp(backendPayload.savedAt) >= timestamp(local.savedAt));

    latestDraftRef.current = merged;
    setAnswers(merged.answers);
    setMetadata({
      currentPageIndex: merged.currentPageIndex,
      totalPages: merged.totalPages,
      answeredPages: merged.answeredPages,
      progressPct: merged.progressPct,
    });
    if (selectedBackend) {
      writeSurveyDraftPayload(key, merged);
      lastBackedUpHashRef.current = hasDraftContent(merged) ? contentHash(merged) : null;
    } else {
      lastBackedUpHashRef.current = null;
    }
    setHydrated(true);
  }, [backendDraft, key]);

  const flushBackup = useCallback(() => {
    if (!slug || backupDisabledRef.current) return;
    const { current } = latestDraftRef;
    if (!hasDraftContent(current)) return;
    const hash = contentHash(current);
    if (hash === lastBackedUpHashRef.current) return;
    lastBackedUpHashRef.current = hash;
    putSurveyDraftKeepalive(slug, toBackupPayload(current));
  }, [slug]);

  useEffect(() => {
    if (!slug || !key) return undefined;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushBackup();
    };
    const handlePageHide = () => flushBackup();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      flushBackup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [flushBackup, key, slug]);

  const setAnswer = useCallback(
    (questionId: number, value: DraftAnswerValue) => {
      const { current } = latestDraftRef;
      const next = {
        ...current,
        answers: { ...current.answers, [questionId]: value },
        savedAt: new Date().toISOString(),
      };
      persist(next);
    },
    [persist],
  );

  // Merge-update a single (questionId, targetUserId) cell without rebuilding
  // the whole per-friend map. Used by per_friend_* question renderers where
  // each row mutates one friend's answer independently. Auto-saves to the
  // same draft localStorage entry as setAnswer.
  const setPerFriendAnswer = useCallback(
    (questionId: number, targetUserId: number, value: ScalarAnswerValue) => {
      const { current } = latestDraftRef;
      const existing = current.answers[questionId];
      const baseMap: PerFriendAnswerMap = isPerFriendAnswerMap(existing) ? existing : {};
      const merged: PerFriendAnswerMap = { ...baseMap, [String(targetUserId)]: value };
      const next = {
        ...current,
        answers: { ...current.answers, [questionId]: merged },
        savedAt: new Date().toISOString(),
      };
      persist(next);
    },
    [persist],
  );

  const updateProgressMetadata = useCallback(
    (nextMetadata: DraftProgressMetadata) => {
      const { current } = latestDraftRef;
      const next = {
        ...current,
        ...nextMetadata,
        savedAt: new Date().toISOString(),
      };
      persist(next);
    },
    [persist],
  );

  const clear = useCallback(() => {
    backupDisabledRef.current = true;
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    latestDraftRef.current = emptyDraft();
    lastBackedUpHashRef.current = null;
    setAnswers({});
    setMetadata({
      currentPageIndex: 0,
      totalPages: 0,
      answeredPages: 0,
      progressPct: 0,
    });
  }, [key]);

  return {
    answers,
    metadata,
    setAnswer,
    setPerFriendAnswer,
    updateProgressMetadata,
    clear,
    hydrated,
  };
}
