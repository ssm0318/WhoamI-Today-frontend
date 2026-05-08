import { useCallback, useRef, useState } from 'react';
import MissionGroupItemComponent from '@components/note/mission-group-item/MissionGroupItem';
import NoteItem from '@components/note/note-item/NoteItem';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Layout, SvgIcon, Typo } from '@design-system';
import { MissionGroupItem, Note, POST_TYPE, Response } from '@models/post';
import {
  CarouselContainer,
  CarouselSlide,
  CarouselTrack,
  Dot,
  DotContainer,
  NavArrow,
  NavBar,
} from './SwipeablePostCarousel.styled';

const GAP = 12;

interface Props {
  posts: (Note | Response | MissionGroupItem)[];
  isMyPage?: boolean;
}

function SwipeablePostCarousel({ posts, isMyPage = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pressedArrow, setPressedArrow] = useState<'prev' | 'next' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? 0;
  }, []);

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(posts.length - 1, i + 1));

  if (posts.length === 0) {
    return (
      <Layout.FlexRow w="100%" justifyContent="center" pv={12}>
        <Typo type="body-medium" color="MEDIUM_GRAY">
          No Recent Posts
        </Typo>
      </Layout.FlexRow>
    );
  }

  const offset = -(currentIndex * (getContainerWidth() + GAP));

  const getPostKey = (post: Note | Response | MissionGroupItem) => {
    if (post.type === POST_TYPE.MISSION_GROUP) {
      const g = post as MissionGroupItem;
      return `mission-${g.mission_id ?? g.attempts[0]?.id}`;
    }
    return `${post.type}-${(post as Note | Response).id}`;
  };

  return (
    <Layout.FlexCol w="100%" gap={0}>
      <CarouselContainer ref={containerRef}>
        <CarouselTrack $offset={offset}>
          {posts.map((post) => (
            <CarouselSlide key={getPostKey(post)}>
              {post.type === POST_TYPE.MISSION_GROUP ? (
                <MissionGroupItemComponent
                  group={post as MissionGroupItem}
                  isMyPage={isMyPage}
                  displayType="LIST"
                />
              ) : post.type === POST_TYPE.NOTE ? (
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
        <NavBar>
          <NavArrow
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            $pressed={pressedArrow === 'prev'}
            onPointerDown={() => setPressedArrow('prev')}
            onPointerUp={() => setPressedArrow(null)}
            onPointerLeave={() => setPressedArrow(null)}
          >
            <SvgIcon name="arrow_left" size={22} />
          </NavArrow>
          <DotContainer>
            {posts.map((post, idx) => (
              <Dot
                key={`dot-${getPostKey(post)}`}
                $active={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </DotContainer>
          <NavArrow
            type="button"
            onClick={handleNext}
            disabled={currentIndex === posts.length - 1}
            $pressed={pressedArrow === 'next'}
            onPointerDown={() => setPressedArrow('next')}
            onPointerUp={() => setPressedArrow(null)}
            onPointerLeave={() => setPressedArrow(null)}
          >
            <SvgIcon name="arrow_right" size={22} />
          </NavArrow>
        </NavBar>
      )}
    </Layout.FlexCol>
  );
}

export default SwipeablePostCarousel;
