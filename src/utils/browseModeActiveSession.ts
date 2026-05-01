/**
 * Per-user, per-tab persistence of the currently active browse mode.
 *
 * Lives in sessionStorage (NOT localStorage) so it survives page refreshes
 * within a single tab but resets on tab close. That matches the user's
 * mental model of "I picked Soft mode for THIS session" — refresh shouldn't
 * forget it, but coming back tomorrow is a fresh decision.
 *
 * Cross-tab and cross-day "do you want to re-pick" prompting stays the
 * responsibility of `useBrowseModeSessionPrompt` — this util only handles
 * the within-tab survival of an already-chosen mode.
 */

import { ActiveBrowseMode } from '@models/browseMode';

const STORAGE_KEY_PREFIX = 'browse_mode_active_session_';

function key(userId: number): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export function readActiveSession(userId: number): ActiveBrowseMode | null {
  try {
    const raw = sessionStorage.getItem(key(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const mode = parsed as { kind?: unknown };
    // Defensive shape check — corrupt entries (schema change, manual
    // tampering) shouldn't blow up rehydration.
    if (mode.kind !== 'built_in' && mode.kind !== 'custom') return null;
    return parsed as ActiveBrowseMode;
  } catch {
    return null;
  }
}

export function writeActiveSession(userId: number, mode: ActiveBrowseMode | null): void {
  try {
    if (mode === null) {
      sessionStorage.removeItem(key(userId));
    } else {
      sessionStorage.setItem(key(userId), JSON.stringify(mode));
    }
  } catch {
    // sessionStorage can throw in private mode / if quota exceeded —
    // best-effort persistence, not worth crashing the app over.
  }
}
