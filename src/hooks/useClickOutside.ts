import { RefObject, useEffect } from 'react';

interface useClickOutsideProps {
  ref: RefObject<HTMLElement>;
  toggleButtonRef?: RefObject<HTMLElement>;
  onClick: () => void;
}

function useClickOutside({ ref, toggleButtonRef, onClick }: useClickOutsideProps) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!toggleButtonRef ||
          (toggleButtonRef && !toggleButtonRef.current?.contains(event.target as Node)))
      ) {
        onClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, onClick, toggleButtonRef]);
}

export default useClickOutside;
