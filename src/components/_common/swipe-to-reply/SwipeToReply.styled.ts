import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

interface ContentProps {
  $offset: number;
  $animating: boolean;
}

export const Content = styled.div.attrs<ContentProps>(({ $offset }) => ({
  style: {
    transform: $offset ? `translateX(${$offset}px)` : '',
  },
}))<ContentProps>`
  width: 100%;
  ${({ $animating }) =>
    $animating ? 'transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1);' : ''}
`;

interface ReplyIconProps {
  $offset: number;
  $triggered: boolean;
}

export const ReplyIcon = styled.div.attrs<ReplyIconProps>(({ $offset }) => {
  const THRESHOLD = 60;
  const progress = Math.min($offset / THRESHOLD, 1);
  return {
    style: {
      opacity: progress,
      transform: `translateY(-50%) scale(${progress})`,
    },
  };
})<ReplyIconProps>`
  position: absolute;
  left: 10px;
  top: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ $triggered }) => ($triggered ? '#D8D8D8' : '#EFEFEF')};
  z-index: 0;
  pointer-events: none;
  transition: background-color 0.15s ease;
`;
