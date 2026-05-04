import { BrowseModeTabKey } from '@models/browseMode';

const PREFIX = 'last_visited_tab_';

const VALID_KEYS: BrowseModeTabKey[] = [
  'friends',
  'update',
  'share',
  'discover',
  'chats',
  'my',
  'questions',
];

function storageKey(userId: number): string {
  return `${PREFIX}${userId}`;
}

export function readLastVisitedTab(userId: number): BrowseModeTabKey | null {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return null;
  return (VALID_KEYS as string[]).includes(raw) ? (raw as BrowseModeTabKey) : null;
}

export function writeLastVisitedTab(userId: number, key: BrowseModeTabKey): void {
  try {
    localStorage.setItem(storageKey(userId), key);
  } catch {
    /* private mode / quota — best-effort */
  }
}
