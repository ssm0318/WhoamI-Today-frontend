import { useEffect, useRef } from 'react';
import { useBoundStore } from '@stores/useBoundStore';
import { readActiveSession, writeActiveSession } from '@utils/browseModeActiveSession';

/**
 * Glue between the in-memory active-mode Zustand state and per-tab
 * sessionStorage. Mount once at Root.
 *
 * - On user-load, if sessionStorage has an active mode for this user, push
 *   it back into the store so the page reflects the same mode the user had
 *   before refreshing. Only does this when the store is empty — never
 *   stomps on a mode the user has already picked in this fresh mount.
 * - On every change to activeBrowseMode (subscription), write through to
 *   sessionStorage so the next refresh has fresh data. clearActiveBrowseMode
 *   writes null (which removes the key) so a real "exit preview" actually
 *   clears the persisted mode.
 */
export function useBrowseModeActivePersistence() {
  const userId = useBoundStore((state) => state.myProfile?.id);
  // Track whether we've already hydrated for this user so we don't
  // overwrite the user's later picks every time the effect re-fires.
  const hydratedFor = useRef<number | null>(null);

  // Hydrate from sessionStorage on user-load.
  useEffect(() => {
    if (!userId) return;
    if (hydratedFor.current === userId) return;
    hydratedFor.current = userId;
    const current = useBoundStore.getState().activeBrowseMode;
    // Don't stomp on a mode the user already picked in this mount —
    // can happen if the picker auto-prompt fires before the rehydration
    // effect runs, or in a re-render race.
    if (current) return;
    const stored = readActiveSession(userId);
    if (stored) {
      useBoundStore.setState({ activeBrowseMode: stored });
    }
  }, [userId]);

  // Subscribe to activeBrowseMode changes and mirror them to sessionStorage.
  // useBoundStore.subscribe gives us the raw zustand subscribe; we ignore
  // changes when there's no userId (anonymous shouldn't persist anything).
  useEffect(() => {
    if (!userId) return undefined;
    const unsub = useBoundStore.subscribe((state, prev) => {
      if (state.activeBrowseMode === prev.activeBrowseMode) return;
      writeActiveSession(userId, state.activeBrowseMode);
    });
    return unsub;
  }, [userId]);
}
