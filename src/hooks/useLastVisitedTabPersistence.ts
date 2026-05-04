import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBoundStore } from '@stores/useBoundStore';
import { getTabKeyForPath } from '@utils/browseModeTabs';
import { writeLastVisitedTab } from '@utils/lastVisitedTab';

/**
 * Mirrors the user's current tab to localStorage so cold-start (Intro
 * redirect) can restore it next session. Detail routes are skipped — the
 * stored value should always be a tab the user can return to directly.
 */
export function useLastVisitedTabPersistence() {
  const userId = useBoundStore((state) => state.myProfile?.id);
  const location = useLocation();

  useEffect(() => {
    if (!userId) return;
    const key = getTabKeyForPath(location.pathname);
    if (!key) return;
    writeLastVisitedTab(userId, key);
  }, [userId, location.pathname]);
}
