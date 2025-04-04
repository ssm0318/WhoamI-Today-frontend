import { useEffect, useRef } from 'react';

interface UseDetectOutsideClick {
  callback: () => void;
  enabled?: boolean;
}

export const useDetectOutsideClick = ({ callback, enabled = true }: UseDetectOutsideClick) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
};
