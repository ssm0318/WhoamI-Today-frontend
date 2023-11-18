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
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      handleOutside(e, onClick);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleOutside, onClick]);

  useEffect(() => {
    const handleTouchOutside = (e: MouseEvent | TouchEvent) => {
      handleOutside(e, onTouch ?? onClick);
    };
    document.addEventListener('touchstart', handleTouchOutside);

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [handleOutside, onClick, onTouch]);
}

export default useClickOutside;
