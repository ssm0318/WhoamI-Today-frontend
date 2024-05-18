import { useEffect } from 'react';

export function usePreventScroll(visible: boolean) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);
}
