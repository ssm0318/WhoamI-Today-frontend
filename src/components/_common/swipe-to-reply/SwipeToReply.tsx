import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import * as S from './SwipeToReply.styled';

const DEAD_ZONE = 8;
const TRIGGER_THRESHOLD = 60;
const MAX_DRAG = 100;

type Phase = 'idle' | 'undecided' | 'swiping' | 'scrolling';

interface TouchState {
  startX: number;
  startY: number;
  phase: Phase;
}

interface Props {
  children: ReactElement;
  onReply: () => void;
}

export function SwipeToReply({ children, onReply }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const touchState = useRef<TouchState>({ startX: 0, startY: 0, phase: 'idle' });
  const onReplyRef = useRef(onReply);
  onReplyRef.current = onReply;

  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);

  const triggered = offset >= TRIGGER_THRESHOLD;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return undefined;

    const onTouchStart = (e: TouchEvent) => {
      if (animating) return;
      const { clientX, clientY } = e.touches[0];
      touchState.current = { startX: clientX, startY: clientY, phase: 'undecided' };
    };

    const onTouchMove = (e: TouchEvent) => {
      const state = touchState.current;
      if (state.phase === 'idle' || state.phase === 'scrolling') return;

      const { clientX, clientY } = e.touches[0];
      const deltaX = clientX - state.startX;
      const deltaY = clientY - state.startY;

      if (state.phase === 'undecided') {
        if (Math.abs(deltaX) < DEAD_ZONE && Math.abs(deltaY) < DEAD_ZONE) return;

        if (Math.abs(deltaY) > Math.abs(deltaX) || deltaX <= 0) {
          state.phase = 'scrolling';
          return;
        }
        state.phase = 'swiping';
      }

      e.preventDefault();

      const clamped = Math.min(Math.max(deltaX, 0), MAX_DRAG);
      const elastic = clamped * (1 - clamped / (MAX_DRAG * 3));
      setOffset(elastic);
    };

    const onTouchEnd = (e: TouchEvent) => {
      const state = touchState.current;
      if (state.phase === 'swiping') {
        e.stopPropagation();
        const currentOffset = offset;
        if (currentOffset >= TRIGGER_THRESHOLD) {
          onReplyRef.current();
        }
        setAnimating(true);
        setOffset(0);
      }
      touchState.current = { startX: 0, startY: 0, phase: 'idle' };
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [animating, offset]);

  const handleTransitionEnd = useCallback(() => {
    setAnimating(false);
  }, []);

  return (
    <S.Wrapper>
      {offset > 0 && (
        <S.ReplyIcon $offset={offset} $triggered={triggered}>
          <Icon name="comment_reply" size={18} color={triggered ? 'BLACK' : 'MEDIUM_GRAY'} />
        </S.ReplyIcon>
      )}
      <S.Content
        ref={contentRef}
        $offset={offset}
        $animating={animating}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </S.Content>
    </S.Wrapper>
  );
}
