import { useLayoutEffect, useState } from 'react';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';

const BOTTOM_TAB_SELECTOR = '[data-bottom-tab]';

export function useBottomTabOffset() {
  const [offset, setOffset] = useState(BOTTOM_TABBAR_HEIGHT);

  useLayoutEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const tab = document.querySelector<HTMLElement>(BOTTOM_TAB_SELECTOR);
      if (!tab) return;

      const measuredHeight = Math.ceil(tab.getBoundingClientRect().height);
      const nextOffset = Math.max(BOTTOM_TABBAR_HEIGHT, measuredHeight);
      setOffset((current) => (current === nextOffset ? current : nextOffset));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(update);
    };

    const tab = document.querySelector<HTMLElement>(BOTTOM_TAB_SELECTOR);
    const observer =
      tab && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleUpdate) : null;
    if (tab) observer?.observe(tab);

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('resize', scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return offset;
}
