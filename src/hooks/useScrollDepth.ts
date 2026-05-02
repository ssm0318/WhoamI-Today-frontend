import { RefObject, useEffect, useRef } from 'react';
import { useTrackEvent } from './useTrackEvent';

/**
 * Reports max scroll depth on a feed-like surface as the user scrolls.
 * Fires `<eventName>_milestone` events at 25/50/75/100% the FIRST time
 * each milestone is crossed during a mount cycle. Tells us not just
 * "how many users scrolled" but "how DEEP they scrolled" — a stronger
 * engagement signal than impressions alone.
 *
 * Pass a ref to the scroll container, or omit it to track window scroll.
 * Throttles handler invocations to ~100ms so a fast scroll doesn't fire
 * thousands of useless updates per second.
 *
 * Backend can't tell scroll depth at all — every API call is for a
 * specific page of results, regardless of how many a user actually saw.
 */
export function useScrollDepth(
  eventName: string,
  scrollRef?: RefObject<HTMLElement>,
  params?: Record<string, string | number>,
) {
  const trackEvent = useTrackEvent();
  // Persist the params reference for the throttle closure but don't re-arm
  // the listener every parent render.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    const target = scrollRef?.current;
    // 25 / 50 / 75 / 100 — anything finer (e.g. 10% steps) is noise; fewer
    // (e.g. 50/100) misses the most actionable middle of the funnel.
    const milestones = [25, 50, 75, 100];
    const reached = new Set<number>();
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const compute = () => {
      let depth = 0;
      if (target) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        const scrollable = scrollHeight - clientHeight;
        depth = scrollable <= 0 ? 100 : (scrollTop / scrollable) * 100;
      } else {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        depth = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;
      }
      milestones.forEach((m) => {
        if (depth >= m && !reached.has(m)) {
          reached.add(m);
          trackEvent(`${eventName}_milestone`, {
            ...(paramsRef.current ?? {}),
            depth_pct: m,
          });
        }
      });
    };

    const onScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        compute();
      }, 100);
    };

    const node: HTMLElement | Window = target ?? window;
    node.addEventListener('scroll', onScroll, { passive: true });
    // Compute once on mount so a short feed that already shows 100% on
    // load still fires the milestone — without this, we'd only count
    // depth gained AFTER mount.
    compute();
    return () => {
      node.removeEventListener('scroll', onScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, scrollRef]);
}
