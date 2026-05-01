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

export const Ring = styled.div<{ $read?: boolean }>`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px solid ${({ $read }) => ($read ? Colors.LIGHT_GRAY : Colors.PRIMARY)};
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;
