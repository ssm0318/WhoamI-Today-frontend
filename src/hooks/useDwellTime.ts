import { useEffect, useRef } from 'react';
import { useTrackEvent } from './useTrackEvent';

/**
 * Fires a single `<eventName>` event on unmount with `duration_ms`.
 * Use for "how long did the user spend on this thing" signals — post
 * detail dwell, modal open time, profile-view duration, etc.
 *
 * Differs from screen_dwell in Root.tsx (which fires for every route
 * change automatically) by being scoped to a specific component's
 * lifecycle, so it works for modals / bottom sheets / sub-views that
 * don't have their own URL.
 *
 * Drops dwells under `minMs` (default 500ms) so accidental opens /
 * mount-then-immediate-unmount cases don't pollute the data with
 * single-digit-millisecond noise.
 *
 * Optional `params` get merged into the emitted event so callers can
 * tag e.g. post type, post id, modal name, etc.
 */
export function useDwellTime(
  eventName: string,
  params?: Record<string, string | number>,
  options?: { minMs?: number },
) {
  const trackEvent = useTrackEvent();
  const startedAtRef = useRef<number>(Date.now());
  const minMs = options?.minMs ?? 500;
  // Stable params reference — same reasoning as useImpressionTracker.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    startedAtRef.current = Date.now();
    return () => {
      const duration_ms = Date.now() - startedAtRef.current;
      if (duration_ms < minMs) return;
      trackEvent(eventName, {
        ...(paramsRef.current ?? {}),
        duration_ms,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName]);
}
