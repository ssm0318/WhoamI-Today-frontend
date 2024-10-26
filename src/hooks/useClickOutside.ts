// useClickOutside.ts
import { RefObject, useCallback, useEffect } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

interface useClickOutsideProps {
  ref: RefObject<HTMLElement>;
  toggleButtonRef?: RefObject<HTMLElement>;
  onClick: Handler;
  onTouch?: Handler;
}

function useClickOutside({ ref, toggleButtonRef, onClick, onTouch }: useClickOutsideProps) {
  const handleOutside = useCallback(
    (event: MouseEvent | TouchEvent, handler: Handler) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!toggleButtonRef ||
          (toggleButtonRef && !toggleButtonRef.current?.contains(event.target as Node)))
      ) {
        handler?.(event);
      }
    },
    [ref, toggleButtonRef],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      handleOutside(e, onClick);
    };
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [handleOutside, onClick]);

  useEffect(() => {
    const handleTouchOutside = (e: TouchEvent) => {
      handleOutside(e, onTouch ?? onClick);
    };
    document.addEventListener('touchstart', handleTouchOutside, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [handleOutside, onClick, onTouch]);
}

export default useClickOutside;
