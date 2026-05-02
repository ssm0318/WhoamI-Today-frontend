import { useCallback, useEffect, useState } from 'react';
import { FeatureFlagKey } from '@constants/featureFlag';
import { useBoundStore } from '@stores/useBoundStore';
import {
  FRESHNESS_MS,
  isSnoozeActive,
  readLastPickedAt,
  writeLastPickedAt,
} from '@utils/browseModeActiveSession';

/**
 * Auto-prompt the Browse Mode picker on app open. Spec: ALWAYS fire when
 *   (a) the user has never picked a mode (first-ever open, or always
 *       skipped before — there's no `last_picked_at` in localStorage), or
 *   (b) it's been more than 15 minutes since their last pick.
 * UNLESS the user has explicitly snoozed via the "Don't show me again
 * today" checkbox — in that case the prompt is suppressed until the
 * local end-of-day, regardless of freshness.
 *
 * Trigger: cold start (component mount with userId + feature flag both
 * loaded). Mounted once at Root, so "cold start" really means page load
 * or full app remount.
 *
 * No cooldown after dismiss — if the user skips, they'll be prompted
 * again next time they open the app (matches the user's spec for the
 * "always skipped" case).
 *
 * No visibility-change re-trigger — brief tab-switches and reloads
 * shouldn't generate a new prompt mid-session. The 15-minute freshness
 * check on the next page load is the only re-trigger.
 *
 * `last_picked_at` is owned by the picker activation path (see
 * BrowseModeSessionPrompt's applyMode) so this hook only READS it.
 */
export function useBrowseModeSessionPrompt() {
  const [shouldShow, setShouldShow] = useState(false);

  const myProfile = useBoundStore((state) => state.myProfile);
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const fetchPresets = useBoundStore((state) => state.fetchCustomBrowseModePresets);

  const userId = myProfile?.id;
  const browseModeEnabled = featureFlags?.[FeatureFlagKey.BROWSE_MODE] ?? false;

  // Cold-start gate: prompt iff user has never picked OR last pick is stale,
  // AND the snooze isn't active. Snooze is checked first because it's the
  // user's most explicit "leave me alone" signal — overrides freshness.
  // Also load saved presets so they're ready when the prompt opens.
  useEffect(() => {
    if (!userId || !browseModeEnabled) return;
    fetchPresets();
    if (isSnoozeActive(userId)) return;
    const lastPickedAt = readLastPickedAt(userId);
    const stale = lastPickedAt === null || Date.now() - lastPickedAt >= FRESHNESS_MS;
    if (stale) setShouldShow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, browseModeEnabled]);

  /**
   * Skip the prompt. Doesn't write anything — no cooldown — so the next
   * time the user opens the app they'll see the prompt again (per spec).
   */
  const dismiss = useCallback(() => {
    setShouldShow(false);
  }, []);

  /**
   * Called after the user actively picked a mode. Records the pick
   * timestamp so the next 15-minute freshness window starts from now;
   * within that window, the prompt won't auto-fire on cold start.
   */
  const finish = useCallback(() => {
    setShouldShow(false);
    if (userId) writeLastPickedAt(userId);
  }, [userId]);

  /** Manually open the prompt (e.g., from the sidebar's Browsing Mode entry). */
  const open = useCallback(() => {
    setShouldShow(true);
  }, []);

  return { shouldShow, dismiss, finish, open };
}
