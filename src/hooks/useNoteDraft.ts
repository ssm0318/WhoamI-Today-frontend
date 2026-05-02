import { useCallback, useEffect, useState } from 'react';

import { PostVisibility } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';

export type NoteDraftContext = 'regular' | 'mission' | 'photo_of_the_day';

interface DraftFields {
  content: string;
  visibility: PostVisibility[];
}

interface DraftPayload {
  content: string;
  visibility: PostVisibility[];
  savedAt: string;
}

const KEY_PREFIX = 'whoami_note_draft_';
const MISSION_KEY_RE = /^whoami_note_draft_(\d+|anon)_mission_(\d+)$/;

const buildKey = (userId: number | null, context: NoteDraftContext, missionId?: number | null) => {
  const userPart = userId ?? 'anon';
  const contextPart = context === 'mission' && missionId != null ? `mission_${missionId}` : context;
  return `${KEY_PREFIX}${userPart}_${contextPart}`;
};

const readDraft = (key: string): DraftFields | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftPayload;
    return {
      content: parsed.content ?? '',
      visibility: parsed.visibility ?? [],
    };
  } catch {
    return null;
  }
};

const writeDraft = (key: string, fields: DraftFields) => {
  try {
    const payload: DraftPayload = { ...fields, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable (private mode, quota); fail silently
  }
};

const deleteKey = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

/**
 * Garbage-collect note-draft localStorage keys for this user's missions whose
 * mission ID doesn't match the current one. Keeps localStorage tidy across
 * day-of-year rollovers without scanning every key on every render.
 */
const gcStaleMissionDrafts = (userId: number | null, currentMissionId: number) => {
  if (typeof localStorage === 'undefined') return;
  const userPart = String(userId ?? 'anon');
  try {
    const staleKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key) {
        const match = key.match(MISSION_KEY_RE);
        if (match && match[1] === userPart && Number(match[2]) !== currentMissionId) {
          staleKeys.push(key);
        }
      }
    }
    staleKeys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
};

export function useNoteDraft(
  context: NoteDraftContext,
  missionId?: number | null,
  options?: { disabled?: boolean },
) {
  const userId = useBoundStore((s) => s.myProfile?.id ?? null);
  const disabled = options?.disabled ?? false;
  const key = disabled ? null : buildKey(userId, context, missionId);

  const [draft, setDraft] = useState<DraftFields | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!key) {
      setHydrated(true);
      return;
    }
    if (context === 'mission' && missionId != null) {
      gcStaleMissionDrafts(userId, missionId);
    }
    setDraft(readDraft(key));
    setHydrated(true);
  }, [key, context, missionId, userId]);

  const save = useCallback(
    (fields: DraftFields) => {
      if (!key) return;
      writeDraft(key, fields);
    },
    [key],
  );

  const clear = useCallback(() => {
    if (!key) return;
    deleteKey(key);
    setDraft(null);
  }, [key]);

  return { draft, save, clear, hydrated };
}
