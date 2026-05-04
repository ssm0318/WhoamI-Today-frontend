import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoundStore } from '@stores/useBoundStore';
import { getTabKeyForPath, getVisibleTabs } from '@utils/browseModeTabs';

/**
 * When `activeBrowseMode` changes (user picks a new mode, custom mode is
 * cleared, tab durations auto-tighten the allowlist), redirect off any tab
 * the new mode no longer surfaces. Detail routes (profile, chat room, etc.)
 * are left alone — only tab-level routes get bounced.
 *
 * First mount is intentionally skipped so the cold-start route restored by
 * Intro.tsx isn't immediately overwritten.
 */
export function useBrowseModeRouteSync() {
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const location = useLocation();
  const navigate = useNavigate();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const currentKey = getTabKeyForPath(location.pathname);
    if (currentKey === null) return;

    const visible = getVisibleTabs(featureFlags, activeBrowseMode);
    if (visible.some((tab) => tab.key === currentKey)) return;

    const first = visible[0];
    if (first) navigate(first.path, { replace: true });
    // Intentionally exclude location.pathname / featureFlags from deps:
    // we only want to react to mode changes, not to the user navigating
    // around within an existing mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBrowseMode]);
}
