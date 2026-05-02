import { useEffect, useRef } from 'react';
import { useBoundStore } from '@stores/useBoundStore';
import { readActiveMode, writeActiveMode } from '@utils/browseModeActiveSession';

/**
 * Glue between the in-memory active-mode Zustand state and per-user
 * localStorage. Mount once at Root.
 *
 * Hydration: on user-load, if the user picked a mode within the last
 * 15 minutes (FRESHNESS_MS in browseModeActiveSession), restore it to
 * the store. Stale picks are dropped.
 *
 * Subscription: every time activeBrowseMode changes (user pick,
 * auto-tighten removing tabs, etc.), mirror it to localStorage. We do
 * NOT touch last_picked_at here — that's owned by the explicit pick
 * paths in BrowseModeSessionPrompt so non-user mutations (auto-tighten,
 * hydration) don't reset the 15-minute freshness window.
 */
export function useBrowseModeActivePersistence() {
  const userId = useBoundStore((state) => state.myProfile?.id);
  const hydratedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (hydratedFor.current === userId) return;
    hydratedFor.current = userId;
    const current = useBoundStore.getState().activeBrowseMode;
    // Don't stomp on a mode the user already picked in this mount —
    // can happen if the picker auto-prompt fires before this effect
    // runs (very tight render race).
    if (current) return;
    const stored = readActiveMode(userId);
    if (stored) {
      useBoundStore.setState({ activeBrowseMode: stored });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return undefined;
    const unsub = useBoundStore.subscribe((state, prev) => {
      if (state.activeBrowseMode === prev.activeBrowseMode) return;
      writeActiveMode(userId, state.activeBrowseMode);
    });
    return unsub;
  }, [userId]);
}
