import { ReactElement, TouchEvent, useContext, useRef, useState } from 'react';
import {
  StyledRightContent,
  StyledSwipeItem,
  StyledSwipeLayout,
} from '@components/_common/swipe-layout/SwipeLayout.styled';
import { SwipeLayoutListContext } from '@components/_common/swipe-layout/SwipeLayoutList';
import useClickOutside from '@hooks/useClickOutside';

const MIN_SWIPE_DISTANCE = 60;
const SWIPE_DISTANCE = 120;
const MAX_SWIPE_DISTANCE = 200;

interface Props {
  children: ReactElement;
  rightContent: ReactElement;
}

/* TODO: animation 추가 */
export function SwipeLayout({ children, rightContent }: Props) {
  const [touchStartX, setTouchStartX] = useState<number>();
  const [touchStartY, setTouchStartY] = useState<number>();
  const [distance, setDistance] = useState<number>();
  const [isTouchMoved, setIsTouchMoved] = useState<boolean>(false);
  const [isSwiped, setIsSwiped] = useState<boolean>(false);

  const { setHasSwipedItem } = useContext(SwipeLayoutListContext);

  const clearSwipeState = () => {
    setIsSwiped(false);
    setDistance(undefined);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const { clientX, clientY } = e.targetTouches[0];
    setTouchStartX(clientX);
    setTouchStartY(clientY);
    setIsTouchMoved(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX === undefined || touchStartY === undefined) return;
    setIsTouchMoved(true);
    const { clientX, clientY } = e.targetTouches[0];

    const diffX = Math.abs(touchStartX - clientX);
    const diffY = Math.abs(touchStartY - clientY);
    if (diffY > diffX) return;

    const d = touchStartX - clientX;
    const dResult = isSwiped ? SWIPE_DISTANCE + d : d;

    if (dResult > MAX_SWIPE_DISTANCE) return;
    setDistance(dResult);
  };

  const handleTouchEnd = () => {
    if (distance === undefined) return;

    if (!isTouchMoved) {
      clearSwipeState();
      return;
    }

    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;

    setIsSwiped(isLeftSwipe);
    setHasSwipedItem(isLeftSwipe);
    setDistance(isLeftSwipe ? SWIPE_DISTANCE : 0);
  };

  const swipeLayoutRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: swipeLayoutRef,
    onTouch: () => {
      if (!isSwiped) return;
      clearSwipeState();
    },
    onClick: () => {
      setHasSwipedItem(false);
    },
  });

  const handleRightContentClick = () => {
    clearSwipeState();
    setHasSwipedItem(false);
  };

  return (
    <StyledSwipeLayout ref={swipeLayoutRef}>
      <StyledSwipeItem
        distance={distance}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </StyledSwipeItem>
      {!!distance && (
        <StyledRightContent distance={distance} onClick={handleRightContentClick}>
          {rightContent}
        </StyledRightContent>
      )}
    </StyledSwipeLayout>
  );
}
