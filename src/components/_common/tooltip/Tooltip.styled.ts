import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

export const Bubble = styled.div<{ visible: boolean }>`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.DARK};
  color: ${({ theme }) => theme.WHITE};
  font-size: 12px;
  line-height: 1.2;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 120ms ease-out;
  z-index: 10;
`;
