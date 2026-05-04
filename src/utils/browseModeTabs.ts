import { FeatureFlagMap } from '@constants/featureFlag';
import { ActiveBrowseMode, BrowseModeTabKey } from '@models/browseMode';

export type VisibleTab = { key: BrowseModeTabKey; path: string };

const ALWAYS_SHOWN: BrowseModeTabKey[] = ['my', 'questions'];

function isInActiveMode(key: BrowseModeTabKey, activeBrowseMode: ActiveBrowseMode | null): boolean {
  if (ALWAYS_SHOWN.includes(key)) return true;
  const allowed = activeBrowseMode?.config.tabs;
  if (!allowed) return true;
  return allowed.includes(key);
}

/**
 * Compute the bottom-tab list the user actually sees, in render order.
 * Mirrors `Tab.tsx` 1:1 — must stay in sync if either is edited.
 */
export function getVisibleTabs(
  featureFlags: FeatureFlagMap | undefined,
  activeBrowseMode: ActiveBrowseMode | null,
): VisibleTab[] {
  const tabs: VisibleTab[] = [];
  const allow = (key: BrowseModeTabKey) => isInActiveMode(key, activeBrowseMode);

  if (featureFlags?.checkInPosts) {
    if (allow('friends')) tabs.push({ key: 'friends', path: '/feed' });
    if (allow('discover')) tabs.push({ key: 'discover', path: '/discover' });
    if (allow('share')) tabs.push({ key: 'share', path: '/share' });
    if (allow('chats')) tabs.push({ key: 'chats', path: '/chats' });
    if (allow('my')) tabs.push({ key: 'my', path: '/my' });
    return tabs;
  }

  if (featureFlags?.friendList) {
    if (allow('friends')) tabs.push({ key: 'friends', path: '/friends' });
    if (allow('update')) tabs.push({ key: 'update', path: '/update' });
    if (allow('share')) tabs.push({ key: 'share', path: '/share' });
    if (allow('discover')) tabs.push({ key: 'discover', path: '/discover' });
  } else if (featureFlags?.friendFeed) {
    if (allow('friends')) tabs.push({ key: 'friends', path: '/feed' });
  }

  if (featureFlags?.questionsTab && allow('questions')) {
    tabs.push({ key: 'questions', path: '/questions' });
  }
  if (featureFlags?.chatTab && allow('chats')) {
    tabs.push({ key: 'chats', path: '/chats' });
  }

  return tabs;
}

const ALL_TAB_PATHS: { path: string; key: BrowseModeTabKey }[] = [
  { path: '/friends', key: 'friends' },
  { path: '/feed', key: 'friends' },
  { path: '/discover', key: 'discover' },
  { path: '/update', key: 'update' },
  { path: '/share', key: 'share' },
  { path: '/chats', key: 'chats' },
  { path: '/my', key: 'my' },
  { path: '/questions', key: 'questions' },
];

/**
 * Map a route pathname to the tab key it represents, or null if the user is
 * on a non-tab detail route (e.g. `/users/:id/profile`, `/notes/new`,
 * `/chats/group/:roomId`). Matches only the exact tab paths so deep routes
 * stay un-mapped.
 */
export function getTabKeyForPath(pathname: string): BrowseModeTabKey | null {
  const match = ALL_TAB_PATHS.find((entry) => entry.path === pathname);
  return match?.key ?? null;
}
