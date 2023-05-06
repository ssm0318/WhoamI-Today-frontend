import styled, { css } from 'styled-components';
import { DividerProps } from './Divider.types';

export const Divider = styled.div<DividerProps>`
  background-color: ${({ theme, bgColor }) => theme[bgColor || 'GRAY_1']};
  ${({ horizontal = true, width = 10, margin, marginLeading, marginTrailing }) =>
    horizontal
      ? css`
          width: 100%;
          height: ${width}px;
          margin-top: ${marginLeading || margin || 0}px;
          margin-bottom: ${marginTrailing || margin || 0}px;
          margin-left: 0;
          margin-right: 0;
        `
      : css`
          width: ${width}px;
          height: 100%;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: ${marginLeading || margin || 0}px;
          margin-right: ${marginTrailing || margin || 0}px;
        `};
`;
