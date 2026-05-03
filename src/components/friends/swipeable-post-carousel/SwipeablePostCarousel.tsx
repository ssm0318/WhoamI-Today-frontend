import { TouchEvent, useCallback, useRef, useState } from 'react';
import NoteItem from '@components/note/note-item/NoteItem';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Layout, Typo } from '@design-system';
import { Note, POST_TYPE, Response } from '@models/post';
import {
  CarouselContainer,
  CarouselSlide,
  CarouselTrack,
  Dot,
  DotContainer,
} from './SwipeablePostCarousel.styled';

const SWIPE_THRESHOLD = 50;
const GAP = 12;

interface Props {
  posts: (Note | Response)[];
  isMyPage?: boolean;
}

function SwipeablePostCarousel({ posts, isMyPage = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? 0;
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    touchStartXRef.current = clientX;
    touchStartYRef.current = clientY;
    isDraggingRef.current = false;
    setIsTransitioning(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    const diffX = clientX - touchStartXRef.current;
    const diffY = Math.abs(clientY - touchStartYRef.current);

    // Vertical scroll takes priority if it's dominant
    if (!isDraggingRef.current && diffY > Math.abs(diffX)) return;

    isDraggingRef.current = true;

    // Clamp drag at boundaries with resistance
    const atStart = currentIndex === 0 && diffX > 0;
    const atEnd = currentIndex === posts.length - 1 && diffX < 0;
    const resistance = atStart || atEnd ? 0.3 : 1;
    const clampedOffset = diffX * resistance;

    // Prevent scrolling when swiping horizontally
    if (Math.abs(diffX) > 10) {
      e.preventDefault();
    }

    setDragOffset(clampedOffset);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) {
      setDragOffset(0);
      return;
    }

    setIsTransitioning(true);

    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset < 0 && currentIndex < posts.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (dragOffset > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    setDragOffset(0);
    isDraggingRef.current = false;
  };

  if (posts.length === 0) {
    return (
      <Layout.FlexRow w="100%" justifyContent="center" pv={12}>
        <Typo type="body-medium" color="MEDIUM_GRAY">
          No Recent Posts
        </Typo>
      </Layout.FlexRow>
    );
  }

  const baseOffset = -(currentIndex * (getContainerWidth() + GAP));

  return (
    <Layout.FlexCol w="100%" gap={0}>
      <CarouselContainer
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CarouselTrack $offset={baseOffset + dragOffset} $isTransitioning={isTransitioning}>
          {posts.map((post) => (
            <CarouselSlide key={`${post.type}-${post.id}`}>
              {post.type === POST_TYPE.NOTE ? (
                <NoteItem
                  note={post as Note}
                  isMyPage={isMyPage}
                  displayType="LIST"
                  isCarouselItem
                />
              ) : (
                <ResponseItem
                  response={post as Response}
                  isMyPage={isMyPage}
                  displayType="LIST"
                  isCarouselItem
                />
              )}
            </CarouselSlide>
          ))}
        </CarouselTrack>
      </CarouselContainer>
      {posts.length > 1 && (
        <DotContainer>
          {posts.map((post, idx) => (
            <Dot key={`dot-${post.type}-${post.id}`} $active={idx === currentIndex} />
          ))}
        </DotContainer>
      )}
    </Layout.FlexCol>
  );
}

export default SwipeablePostCarousel;
