import { RefObject, useEffect, useRef } from 'react';
import { useTrackEvent } from './useTrackEvent';

/**
 * Tracks the cumulative time a ref'd element was actually visible (>=
 * `threshold` of its area in the viewport) across the component's mount
 * cycle, and fires a single `<eventName>` event on unmount with
 * `visible_ms` (and a count of distinct in/out cycles).
 *
 * Differs from `useDwellTime`:
 *   - useDwellTime measures mount→unmount, regardless of viewport.
 *   - useVisibleDwell measures only the time the element was on screen.
 *
 * Differs from `useImpressionTracker`:
 *   - Impression fires once on first sustained visibility — a Boolean.
 *   - This accumulates ACTUAL viewing time, including multiple scroll-
 *     in / scroll-out cycles. Lets us tell "user scrolled past in 200ms"
 *     from "user lingered for 8 seconds across 3 returns".
 *
 * Use for "how long did the user actually look at this section?" signals
 * — interest chips, pinned posts, profile bio, etc. Drops totals under
 * `minMs` (default 500ms) so accidental scroll-byes don't pollute data.
 *
 * Skipped silently in environments without IntersectionObserver (older
 * WebView shells); the unmount event still fires with visible_ms=0.
 */
export function useVisibleDwell<T extends Element>(
  ref: RefObject<T>,
  eventName: string,
  params?: Record<string, string | number>,
  options?: { threshold?: number; minMs?: number },
) {
  const trackEvent = useTrackEvent();
  const threshold = options?.threshold ?? 0.5;
  const minMs = options?.minMs ?? 500;
  // Mutable accumulators — refs so the IO callback closure sees latest
  // values without re-arming.
  const totalVisibleMsRef = useRef(0);
  const visibleSinceRef = useRef<number | null>(null);
  const visibleCyclesRef = useRef(0);
  // Stable params reference so re-renders don't re-arm the observer.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= threshold;
        if (isVisible && visibleSinceRef.current === null) {
          visibleSinceRef.current = Date.now();
          visibleCyclesRef.current += 1;
        } else if (!isVisible && visibleSinceRef.current !== null) {
          totalVisibleMsRef.current += Date.now() - visibleSinceRef.current;
          visibleSinceRef.current = null;
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => {
      // Close out an in-flight visible cycle if the element was on screen
      // when the component unmounted.
      if (visibleSinceRef.current !== null) {
        totalVisibleMsRef.current += Date.now() - visibleSinceRef.current;
        visibleSinceRef.current = null;
      }
      observer.disconnect();
      const visible_ms = totalVisibleMsRef.current;
      if (visible_ms < minMs) return;
      trackEvent(eventName, {
        ...(paramsRef.current ?? {}),
        visible_ms,
        cycles: visibleCyclesRef.current,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, threshold, minMs]);
}
