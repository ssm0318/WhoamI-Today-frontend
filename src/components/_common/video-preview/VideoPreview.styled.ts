import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const Video = styled.video<{ $size: number; $borderRadius: number }>`
  max-width: ${({ $size }) => $size}px;
  height: auto;
  display: block;
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  background: #000;
  object-fit: cover;
`;

export const PlayOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;
