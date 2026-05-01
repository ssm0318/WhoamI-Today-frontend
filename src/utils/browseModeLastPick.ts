/**
 * Per-user persistence of the user's most recently activated browse mode.
 * Used to PRE-SELECT the last-used card in the session-start prompt rather
 * than rendering a separate "Use my last mode" row above the list.
 *
 * Stores either `built_in:<id>` (for one of the 3 built-in modes) or
 * `custom:<id>` (for a saved custom preset). Returned untouched —
 * downstream code parses the prefix.
 */

import { ActiveBrowseMode } from '@models/browseMode';

const STORAGE_KEY_PREFIX = 'browse_mode_last_picked_';

function key(userId: number): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export function saveLastPickedMode(userId: number, mode: ActiveBrowseMode): void {
  const value = mode.kind === 'built_in' ? `built_in:${mode.id}` : `custom:${mode.id}`;
  localStorage.setItem(key(userId), value);
}

export function readLastPickedMode(userId: number): string | null {
  return localStorage.getItem(key(userId));
}

export function isBuiltInPicked(stored: string | null, builtInId: string): boolean {
  return stored === `built_in:${builtInId}`;
}

export function isCustomPicked(stored: string | null, customId: number): boolean {
  return stored === `custom:${customId}`;
}
