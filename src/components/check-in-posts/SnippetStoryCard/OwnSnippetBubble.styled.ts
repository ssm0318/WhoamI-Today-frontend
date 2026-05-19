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

export const AddBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${Colors.PRIMARY};
  border: 2px solid ${Colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  padding: 0;
  transition: background 0.15s ease;

  &:active {
    background: #6600cc;
  }
`;

export const AddBadgeIcon = styled.span`
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
  color: ${Colors.WHITE};
`;
