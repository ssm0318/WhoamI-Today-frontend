import styled from 'styled-components';
import { Colors } from '@design-system';

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const CarouselTrack = styled.div<{ $offset: number }>`
  display: flex;
  width: 100%;
  gap: 12px;
  transform: translateX(${({ $offset }) => $offset}px);
  transition: transform 0.3s ease;
  will-change: transform;
`;

export const CarouselSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
`;

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  padding: 8px 0 4px;
`;

export const NavArrow = styled.button<{ $pressed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background-color: ${({ $pressed, theme }) => ($pressed ? theme.LIGHT_GRAY : 'transparent')};
  border-radius: 50%;
  color: ${({ theme }) => theme.DARK_GRAY};
  cursor: pointer;
  flex-shrink: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    color: ${({ theme }) => theme.LIGHT_GRAY};
    cursor: default;
  }
`;

export const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  transition: background-color 0.2s;
  cursor: pointer;
`;
