import { ComponentVisibility } from '@models/checkIn';

// Per-key remembered visibility, persisted to localStorage so each toggle
// (check-in component, profile field, share flow, etc.) defaults to the
// user's most recent choice for that specific content type. Predetermined
// defaults only apply the very first time the user shares that type.
//
// localStorage in WKWebView / Android WebView is sandboxed to the app and
// survives backgrounding, app restarts, device restarts, OS updates, and
// app offload. It only resets on uninstall / reinstall, explicit Clear Data,
// or new device — all acceptable here since the data is convenience, not
// integrity.

const STORAGE_KEY = 'whoamiTodayLastVisibility';

type Store = Record<string, ComponentVisibility>;

function readStore(): Store {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

export function getLastVisibility(key: string): ComponentVisibility | undefined {
  return readStore()[key];
}

export function setLastVisibility(key: string, value: ComponentVisibility): void {
  try {
    const store = readStore();
    store[key] = value;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Best-effort — private mode / quota errors silently no-op.
  }
}

/** Stable keys per content type so call sites can't accidentally diverge. */
export const VisibilityMemoryKeys = {
  checkInBattery: 'checkin.battery',
  checkInMood: 'checkin.mood',
  checkInSong: 'checkin.song',
  checkInThought: 'checkin.thought',
  share: {
    photo: 'share.photo',
    note: 'share.note',
  },
  profile: {
    name: 'profile.name',
    pronouns: 'profile.pronouns',
    bio: 'profile.bio',
    chipCategory: (category: string) => `profile.chip.${category}`,
  },
} as const;
