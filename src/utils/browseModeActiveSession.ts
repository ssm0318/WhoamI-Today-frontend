/**
 * Per-user persistence of the currently active browse mode plus a timestamp
 * of when the user last actively *picked* one.
 *
 * Spec: the picker auto-prompt fires when the user opens the app and either
 *   (a) has never picked a mode, or
 *   (b) it's been more than 15 minutes since their last pick.
 * Within the 15-minute freshness window, the picked mode is restored on
 * load so the user keeps the experience they chose.
 *
 * Switched from sessionStorage to localStorage so the same mode is
 * available across tabs and after the tab is closed-and-reopened — the
 * 15-minute window is now the source of "is this the same session?"
 * rather than tab lifetime.
 */

import { ActiveBrowseMode } from '@models/browseMode';

const ACTIVE_MODE_PREFIX = 'browse_mode_active_';
const LAST_PICKED_AT_PREFIX = 'browse_mode_last_picked_at_';

/** 15 minutes — anything past this and the auto-prompt fires on next open. */
export const FRESHNESS_MS = 15 * 60 * 1000;

function activeModeKey(userId: number): string {
  return `${ACTIVE_MODE_PREFIX}${userId}`;
}

function lastPickedAtKey(userId: number): string {
  return `${LAST_PICKED_AT_PREFIX}${userId}`;
}

export function readLastPickedAt(userId: number): number | null {
  const raw = localStorage.getItem(lastPickedAtKey(userId));
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function writeLastPickedAt(userId: number, when: number = Date.now()): void {
  try {
    localStorage.setItem(lastPickedAtKey(userId), String(when));
  } catch {
    /* private mode / quota — best-effort */
  }
}

export function clearLastPickedAt(userId: number): void {
  localStorage.removeItem(lastPickedAtKey(userId));
}

/** True iff the user picked a mode within the last FRESHNESS_MS. */
export function isPickFresh(userId: number): boolean {
  const ts = readLastPickedAt(userId);
  if (ts === null) return false;
  return Date.now() - ts < FRESHNESS_MS;
}

/**
 * Read the persisted active mode, but only if the last pick is still fresh.
 * Stale data is cleared as a side effect so subsequent reads are clean.
 */
export function readActiveMode(userId: number): ActiveBrowseMode | null {
  if (!isPickFresh(userId)) {
    // Drop stale data so we don't carry it across the freshness boundary.
    localStorage.removeItem(activeModeKey(userId));
    clearLastPickedAt(userId);
    return null;
  }
  const raw = localStorage.getItem(activeModeKey(userId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const mode = parsed as { kind?: unknown };
    // Defensive shape check — don't rehydrate corrupt entries.
    if (mode.kind !== 'built_in' && mode.kind !== 'custom') return null;
    return parsed as ActiveBrowseMode;
  } catch {
    return null;
  }
}

export function writeActiveMode(userId: number, mode: ActiveBrowseMode | null): void {
  try {
    if (mode === null) {
      localStorage.removeItem(activeModeKey(userId));
    } else {
      localStorage.setItem(activeModeKey(userId), JSON.stringify(mode));
    }
  } catch {
    /* private mode / quota — best-effort */
  }
}
