import { ReactElement, TouchEvent, useContext, useRef, useState } from 'react';
import {
  StyledLeftContent,
  StyledRightContent,
  StyledSwipeItem,
  StyledSwipeLayout,
} from '@components/_common/swipe-layout/SwipeLayout.styled';
import { SwipeLayoutListContext } from '@components/_common/swipe-layout/SwipeLayoutList';
import useClickOutside from '@hooks/useClickOutside';

const MIN_SWIPE_DISTANCE = 60;
const SWIPE_DISTANCE = 130;
const MAX_SWIPE_DISTANCE = 200;

interface Props {
  children: ReactElement;
  rightContent?: ReactElement;
  leftContent?: ReactElement;
}

type SwipingDirection = 'left' | 'right' | 'none';

/* TODO: animation 추가 */
export function SwipeLayout({ children, rightContent, leftContent }: Props) {
  const [touchStartX, setTouchStartX] = useState<number>();
  const [touchStartY, setTouchStartY] = useState<number>();
  const [distance, setDistance] = useState<number>();
  const [isTouchMoved, setIsTouchMoved] = useState<boolean>(false);
  const [isSwiped, setIsSwiped] = useState<boolean>(false);
  const [swipingDirection, setSwipingDirection] = useState<SwipingDirection>('none');

  const { setHasSwipedItem } = useContext(SwipeLayoutListContext);

  const clearSwipeState = () => {
    setIsSwiped(false);
    setSwipingDirection('none');
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
    if (swipingDirection === 'none' && diffY > diffX) return;

    const dist = touchStartX - clientX;
    const currDirection =
      swipingDirection === 'none' ? (dist < 0 ? 'left' : 'right') : swipingDirection;
    const dResult = isSwiped
      ? currDirection === 'left'
        ? dist - SWIPE_DISTANCE
        : SWIPE_DISTANCE + dist
      : dist;

    if ((dResult < 0 && !leftContent) || (dResult > 0 && !rightContent)) return;
    if (Math.abs(dResult) > MAX_SWIPE_DISTANCE) return;
    setSwipingDirection(currDirection);

    if ((currDirection === 'left' && dResult > 0) || (currDirection === 'right' && dResult < 0)) {
      setDistance(0);
      return;
    }

    setDistance(dResult);
  };

  const handleTouchEnd = () => {
    console.log('swipingDirection', swipingDirection);
    if (distance === undefined || swipingDirection === 'none') return;

    if (!isTouchMoved) {
      clearSwipeState();
      return;
    }

    const isSwipeCompleted = Math.abs(distance) > MIN_SWIPE_DISTANCE;
    const dist = swipingDirection === 'left' ? -SWIPE_DISTANCE : SWIPE_DISTANCE;

    setIsSwiped(isSwipeCompleted);
    setHasSwipedItem(isSwipeCompleted);
    setDistance(isSwipeCompleted ? dist : 0);
    setSwipingDirection((prev) => (isSwipeCompleted ? prev : 'none'));
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

  const handleContentClick = () => {
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
      {!!distance && distance <= 0 && leftContent && (
        <StyledLeftContent distance={distance} onClick={handleContentClick}>
          {leftContent}
        </StyledLeftContent>
      )}
      {!!distance && distance >= 0 && rightContent && (
        <StyledRightContent distance={distance} onClick={handleContentClick}>
          {rightContent}
        </StyledRightContent>
      )}
    </StyledSwipeLayout>
  );
}
