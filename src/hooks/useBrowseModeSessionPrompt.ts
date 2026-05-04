import { useCallback, useEffect, useState } from 'react';
import { FeatureFlagKey } from '@constants/featureFlag';
import { useBoundStore } from '@stores/useBoundStore';
import {
  hasShownPromptThisSlot,
  isSnoozeActive,
  markPromptShownThisSlot,
  writeLastPickedAt,
} from '@utils/browseModeActiveSession';

/**
 * Auto-prompt the Browse Mode picker on app open.
 *
 * Frequency cap: at most one auto-fire per day-slot (morning / afternoon /
 * evening — boundaries at noon and 6pm local), so users see the prompt up
 * to 3× a day no matter how often they open the app. The previous
 * 15-minute freshness gate was too noisy. The "Don't show me again today"
 * snooze still overrides everything — explicit user opt-out wins over the
 * slot heuristic.
 *
 * Trigger: cold start (component mount with userId + feature flag both
 * loaded). Mounted once at Root, so "cold start" really means page load
 * or full app remount.
 *
 * `last_picked_at` is still written when the user actively picks a mode
 * (see {@link finish}) — that timestamp drives the active-mode rehydrate
 * window in `readActiveMode`, separate from auto-prompt frequency.
 */
export function useBrowseModeSessionPrompt() {
  const [shouldShow, setShouldShow] = useState(false);

  const myProfile = useBoundStore((state) => state.myProfile);
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const fetchPresets = useBoundStore((state) => state.fetchCustomBrowseModePresets);

  const userId = myProfile?.id;
  const browseModeEnabled = featureFlags?.[FeatureFlagKey.BROWSE_MODE] ?? false;

  // Cold-start gate: snooze always wins; otherwise fire iff this day-slot
  // hasn't already shown the prompt. Mark the slot as shown immediately
  // so the prompt doesn't re-fire mid-slot if Root remounts (e.g. nav).
  useEffect(() => {
    if (!userId || !browseModeEnabled) return;
    fetchPresets();
    if (isSnoozeActive(userId)) return;
    if (hasShownPromptThisSlot(userId)) return;
    markPromptShownThisSlot(userId);
    setShouldShow(true);
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
