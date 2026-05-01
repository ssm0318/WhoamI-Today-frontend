/**
 * Per-user persistence of which browsing modes the user has chosen to
 * hide from the picker. Covers both:
 *
 * - built-in modes (hardcoded constants — no other "delete" exists for
 *   them, so this is the only way the user can declutter the list)
 * - custom saved presets (user can also fully delete via the API, but
 *   most of the time they'd rather hide-and-restore than lose work)
 *
 * Storage shape: JSON array of mode keys in the form `built_in:<id>` or
 * `custom:<numeric-id>`, e.g. `["built_in:very_social", "custom:5"]`.
 * Malformed / unknown entries are filtered on read so a renamed built-in
 * or deleted custom preset doesn't leave a phantom in the user's list.
 *
 * Storage key carries the legacy `browse_mode_hidden_builtins_` prefix
 * so users with previously-hidden built-ins keep them hidden after this
 * extension to custom presets — no migration needed.
 */

import { BuiltInBrowseModeId } from '@models/browseMode';

const STORAGE_KEY_PREFIX = 'browse_mode_hidden_builtins_';
const BUILT_IN_IDS: BuiltInBrowseModeId[] = ['very_social', 'selectively_social', 'quiet'];

export type HiddenModeKey = `built_in:${BuiltInBrowseModeId}` | `custom:${number}`;

export function builtInKey(id: BuiltInBrowseModeId): HiddenModeKey {
  return `built_in:${id}`;
}

export function customKey(id: number): HiddenModeKey {
  return `custom:${id}`;
}

function isValidKey(value: unknown): value is HiddenModeKey {
  if (typeof value !== 'string') return false;
  if (value.startsWith('built_in:')) {
    return BUILT_IN_IDS.includes(value.slice('built_in:'.length) as BuiltInBrowseModeId);
  }
  if (value.startsWith('custom:')) {
    const id = Number(value.slice('custom:'.length));
    return Number.isInteger(id) && id > 0;
  }
  return false;
}

function key(userId: number): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export function readHiddenModes(userId: number): HiddenModeKey[] {
  const raw = localStorage.getItem(key(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidKey);
  } catch {
    return [];
  }
}

export function writeHiddenModes(userId: number, keys: HiddenModeKey[]): void {
  localStorage.setItem(key(userId), JSON.stringify(keys));
}
