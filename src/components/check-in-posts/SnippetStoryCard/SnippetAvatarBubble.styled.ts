import styled from 'styled-components';
import { Colors } from '@design-system';
import { CheckInPostVisibility } from '@models/checkInPost';

const getVisibilityColor = (visibility: CheckInPostVisibility, read?: boolean) => {
  if (read) return Colors.LIGHT_GRAY;
  if (visibility === 'close_friends') return Colors.TERTIARY_PINK;
  if (visibility === 'public') return Colors.UPDATED;
  return Colors.PRIMARY;
};

const getBadgeColor = (visibility: CheckInPostVisibility) => {
  if (visibility === 'close_friends') return Colors.TERTIARY_PINK;
  if (visibility === 'public') return Colors.UPDATED;
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
  border: 2px ${({ $visibility }) => ($visibility === 'close_friends' ? 'dashed' : 'solid')}
    ${({ $read, $visibility }) => getVisibilityColor($visibility, $read)};
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VisibilityBadge = styled.span<{ $visibility: CheckInPostVisibility }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $visibility }) => getBadgeColor($visibility)};
  border: 2px solid ${Colors.WHITE};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;
