import { RefObject, useEffect } from 'react';

interface useClickOutsideProps {
  ref: RefObject<HTMLElement>;
  onClick: () => void;
}

function useClickOutside({ ref, onClick }: useClickOutsideProps) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      console.log(11, event);
      if (ref.current && !ref.current.contains(event.target as Node)) {
        console.log(13);
        onClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    };
  }, [ref, onClick]);
}

export default useClickOutside;
