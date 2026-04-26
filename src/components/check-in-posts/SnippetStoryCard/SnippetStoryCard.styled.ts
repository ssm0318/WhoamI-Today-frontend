import styled from 'styled-components';
import { Colors } from '@design-system';

export const Card = styled.button`
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

export const Thumb = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${Colors.LIGHT};
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TextThumb = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const AuthorBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  border-radius: 50%;
  border: 2px solid ${Colors.WHITE};
  overflow: hidden;
  line-height: 0;
`;

export const PinBadge = styled.span`
  position: absolute;
  bottom: 4px;
  left: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${Colors.PRIMARY};
  border: 2px solid ${Colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
`;
