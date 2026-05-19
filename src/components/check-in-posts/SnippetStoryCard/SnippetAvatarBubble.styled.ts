import styled from 'styled-components';
import { Colors } from '@design-system';
import { CheckInPostVisibility } from '@models/checkInPost';

const getVisibilityColor = (visibility: CheckInPostVisibility, read?: boolean) => {
  if (visibility === 'close_friends') return Colors.TERTIARY_PINK;
  if (read) return Colors.LIGHT_GRAY;
  return Colors.PRIMARY;
};

export const Bubble = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  width: 80px;
  padding: 0;
`;

export const RingWrapper = styled.div`
  position: relative;
  width: 68px;
  height: 68px;
`;

export const Ring = styled.div<{ $read?: boolean; $visibility: CheckInPostVisibility }>`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px solid ${({ $read, $visibility }) => getVisibilityColor($visibility, $read)};
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $read, $visibility }) => ($read && $visibility === 'close_friends' ? 0.65 : 1)};
`;
