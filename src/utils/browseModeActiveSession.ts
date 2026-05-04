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
const SNOOZE_UNTIL_PREFIX = 'browse_mode_snooze_until_';
const PROMPT_SHOWN_SLOT_PREFIX = 'browse_mode_prompt_shown_slot_';

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

function snoozeUntilKey(userId: number): string {
  return `${SNOOZE_UNTIL_PREFIX}${userId}`;
}

/**
 * "Don't show me again today" snooze. Stores the local end-of-day timestamp
 * (23:59:59.999 today) — the auto-prompt is suppressed until that moment.
 * Distinct from the 15-minute freshness window: snooze is an explicit user
 * request that overrides freshness regardless of pick history.
 */
export function readSnoozeUntil(userId: number): number | null {
  const raw = localStorage.getItem(snoozeUntilKey(userId));
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function writeSnoozeUntilEndOfDay(userId: number): void {
  // Local timezone end-of-day (23:59:59.999). Crossing midnight clears the
  // snooze automatically since `isSnoozeActive` checks against `Date.now()`.
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();
  try {
    localStorage.setItem(snoozeUntilKey(userId), String(endOfDay));
  } catch {
    /* private mode / quota — best-effort */
  }
}

export function clearSnoozeUntil(userId: number): void {
  localStorage.removeItem(snoozeUntilKey(userId));
}

export function isSnoozeActive(userId: number): boolean {
  const ts = readSnoozeUntil(userId);
  if (ts === null) return false;
  if (Date.now() < ts) return true;
  // Past the snooze deadline — clear stale entry as a side effect so future
  // reads don't re-check expired data.
  clearSnoozeUntil(userId);
  return false;
}

// ---- Per-day slot tracking for the auto-prompt ---------------------------
// Cap the auto-prompt at ~3 firings per day, distributed across morning /
// afternoon / evening slots. Once the prompt has been *shown* in a slot we
// don't fire again until the next slot, even if the user dismisses without
// picking. Per-device localStorage — no cross-device sync.
type PromptSlot = 'morning' | 'afternoon' | 'evening';

function currentSlot(now: Date = new Date()): PromptSlot {
  const h = now.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

/** "YYYY-MM-DD_<slot>" — local date so the slot rolls over at midnight. */
function currentSlotKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}_${currentSlot(now)}`;
}

function promptShownSlotKey(userId: number): string {
  return `${PROMPT_SHOWN_SLOT_PREFIX}${userId}`;
}

/** True iff the auto-prompt has already been shown in the current slot. */
export function hasShownPromptThisSlot(userId: number): boolean {
  const stored = localStorage.getItem(promptShownSlotKey(userId));
  return stored === currentSlotKey();
}

/** Mark the current slot as "prompt shown" so we don't re-fire within it. */
export function markPromptShownThisSlot(userId: number): void {
  try {
    localStorage.setItem(promptShownSlotKey(userId), currentSlotKey());
  } catch {
    /* private mode / quota — best-effort */
  }
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
