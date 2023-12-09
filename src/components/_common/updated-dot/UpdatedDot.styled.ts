import styled from 'styled-components';
import { ColorType } from '@design-system';

interface UpdatedDotProps {
  color?: ColorType;
  left?: number;
  top?: number;
  bottom?: number;
  right?: number;
}
export const UpdatedDot = styled.div<UpdatedDotProps>`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: ${({ color, theme }) => color ?? theme.PRIMARY};
  position: absolute;
  ${({ left }) => `${left !== undefined ? `left: ${left}px` : ''}`};
  ${({ top }) => `${top !== undefined ? `top: ${top}px` : ''}`};
  ${({ right }) => `${right !== undefined ? `right: ${right}px` : ''}`};
  ${({ bottom }) => `${bottom !== undefined ? `left: ${bottom}px` : ''}`};
`;
