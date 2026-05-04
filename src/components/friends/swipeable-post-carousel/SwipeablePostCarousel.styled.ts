import styled from 'styled-components';
import { Colors } from '@design-system';

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const CarouselTrack = styled.div<{ $offset: number; $isTransitioning: boolean }>`
  display: flex;
  width: 100%;
  gap: 12px;
  transform: translateX(${({ $offset }) => $offset}px);
  transition: ${({ $isTransitioning }) => ($isTransitioning ? 'transform 0.3s ease' : 'none')};
  will-change: transform;
`;

export const CarouselSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.WHITE};
`;

export const DotContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px 0 4px;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ $active }) => ($active ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  transition: background-color 0.2s;
`;
