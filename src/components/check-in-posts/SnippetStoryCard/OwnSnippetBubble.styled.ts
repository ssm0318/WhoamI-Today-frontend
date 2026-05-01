import styled from 'styled-components';
import { Colors } from '@design-system';

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

export const Ring = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px solid ${Colors.LIGHT_GRAY};
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
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
