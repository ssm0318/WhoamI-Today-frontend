import { RefObject, useEffect } from 'react';
import { useTrackEvent } from './useTrackEvent';

/**
 * Fires an analytics impression event the first time the given element
 * has spent at least `minVisibleMs` continuously inside the viewport with
 * at least `threshold` of its area visible. Each ref instance fires at
 * most once per mount cycle — re-mounting the component re-arms it.
 *
 * Why this design (rather than firing on first intersection):
 *   - "Element rendered above the fold" is not the same as "user actually
 *     looked at it". A scroll-by impression where the card is in view for
 *     50ms doesn't count as engagement.
 *   - 500ms is the same threshold YouTube / GA4 use for "viewable".
 *   - One-shot: an impression is a Boolean per-mount, not a continuous
 *     stream of events.
 *
 * Use this for read-only consumption signals that the backend can't see
 * (Discover cards rendered, friend cards seen, story tiles visible, etc.).
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useImpressionTracker(ref, 'discover_card_impressed', { card_type: 'mutual_trait' });
 *   return <div ref={ref}>...</div>;
 *
 * In a scroll container, every card mounts at once but only fires when
 * actually intersected — so a card that never scrolls into view never
 * emits an event.
 */
export function useImpressionTracker<T extends Element>(
  ref: RefObject<T>,
  eventName: string,
  params?: Record<string, string | number>,
  options?: { minVisibleMs?: number; threshold?: number },
) {
  const trackEvent = useTrackEvent();
  // Stringify the params so we don't re-arm the observer on every parent
  // render (object identity changes constantly even when keys are stable).
  const paramsKey = params ? JSON.stringify(params) : '';
  const minVisibleMs = options?.minVisibleMs ?? 500;
  const threshold = options?.threshold ?? 0.5;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    let firedThisMount = false;
    let visibleSince: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firedThisMount) return;
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (visibleSince === null) {
            visibleSince = Date.now();
            timer = setTimeout(() => {
              if (firedThisMount) return;
              firedThisMount = true;
              trackEvent(eventName, params);
              observer.disconnect();
            }, minVisibleMs);
          }
        } else {
          // Left the viewport before the dwell timer fired — reset.
          visibleSince = null;
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, paramsKey, minVisibleMs, threshold]);
}
