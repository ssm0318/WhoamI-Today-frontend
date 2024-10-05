import { useCallback, useLayoutEffect, useRef } from 'react';
import { getItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';

const SESSION_STORAGE_KEY = 'WHOAMI_TODAY_SCROLL_POSITION';

export interface ScrollPositionStore {
  friendsPage?: number;
  questionsPage?: number;
  myPage?: number;
}

export function useRestoreScrollPosition(key: keyof ScrollPositionStore) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const saveScrollPosition = useCallback(() => {
    const scrollPosition = scrollRef.current?.scrollTop;

    const prevState = getItemFromSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY);
    setItemToSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY, {
      ...prevState,
      [key]: scrollPosition ?? 0,
    });
  }, [key]);

  useLayoutEffect(() => {
    const scrollPositionState = getItemFromSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY);
    scrollRef.current?.scrollTo({ top: scrollPositionState?.[key] ?? 0 });

    return () => {
      saveScrollPosition();
    };
  }, [key, saveScrollPosition]);

  return {
    scrollRef,
  };
}

export const resetScrollPosition = (key: keyof ScrollPositionStore) => {
  const prevState = getItemFromSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY);

  setItemToSessionStorage<ScrollPositionStore>(SESSION_STORAGE_KEY, {
    ...prevState,
    [key]: 0,
  });
};
