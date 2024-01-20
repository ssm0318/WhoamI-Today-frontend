import { ReactElement, TouchEvent, useContext, useRef, useState } from 'react';
import {
  StyledLeftContent,
  StyledRightContent,
  StyledSwipedItem,
  StyledSwipeLayout,
} from '@components/_common/swipe-layout/SwipeLayout.styled';
import { SwipeLayoutListContext } from '@components/_common/swipe-layout/SwipeLayoutList';
import { Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';

const DEFAULT_ITEM_WIDTH = 65;

interface Props {
  children: ReactElement | ReactElement[];
  rightContent?: ReactElement[];
  leftContent?: ReactElement[];
  itemWidth?: number;
}

type SwipingDirection = 'left' | 'right' | 'none';

/* TODO: animation 추가 */
export function SwipeLayout({
  children,
  rightContent,
  leftContent,
  itemWidth = DEFAULT_ITEM_WIDTH,
}: Props) {
  const [touchStartX, setTouchStartX] = useState<number>();
  const [touchStartY, setTouchStartY] = useState<number>();
  const [distance, setDistance] = useState<number>();
  const [isTouchMoved, setIsTouchMoved] = useState<boolean>(false);
  const [isSwiped, setIsSwiped] = useState<boolean>(false);
  const [swipingDirection, setSwipingDirection] = useState<SwipingDirection>('none');

  const leftContentWidth = leftContent ? leftContent.length * itemWidth : 0;
  const minLeftContentWidth = leftContentWidth * 0.5;
  const maxLeftContentWidth = leftContentWidth * 1.5;
  const rightContentWidth = rightContent ? rightContent.length * itemWidth : 0;
  const minRightContentWidth = rightContentWidth * 0.5;
  const maxRightContentWidth = rightContentWidth * 1.5;

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
        ? dist - leftContentWidth
        : rightContentWidth + dist
      : dist;

    if ((dResult < 0 && !leftContent) || (dResult > 0 && !rightContent)) return;

    const maxDistance = swipingDirection === 'left' ? maxLeftContentWidth : maxRightContentWidth;

    if (Math.abs(dResult) > maxDistance) return;
    setSwipingDirection(currDirection);

    if ((currDirection === 'left' && dResult > 0) || (currDirection === 'right' && dResult < 0)) {
      setDistance(0);
      return;
    }

    setDistance(dResult);
  };

  const handleTouchEnd = () => {
    if (distance === undefined || swipingDirection === 'none') return;

    if (!isTouchMoved) {
      clearSwipeState();
      return;
    }

    const minDistance = swipingDirection === 'left' ? minLeftContentWidth : minRightContentWidth;
    const isSwipeCompleted = Math.abs(distance) > minDistance;
    const dist = swipingDirection === 'left' ? -leftContentWidth : rightContentWidth;

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
      <StyledSwipedItem
        distance={distance}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </StyledSwipedItem>
      {!!distance && distance <= 0 && leftContent && (
        <StyledLeftContent distance={distance} onClick={handleContentClick}>
          <Layout.FlexRow w="100%" h="100%" alignItems="center">
            {leftContent}
          </Layout.FlexRow>
        </StyledLeftContent>
      )}
      {!!distance && distance >= 0 && rightContent && (
        <StyledRightContent distance={distance} onClick={handleContentClick}>
          <Layout.FlexRow w="100%" h="100%" alignItems="center">
            {rightContent}
          </Layout.FlexRow>
        </StyledRightContent>
      )}
    </StyledSwipeLayout>
  );
}
