import styled, { css } from 'styled-components';
import { SCREEN_WIDTH } from '@constants/layout';
import { LayoutBase } from './Flex';
import { BgColor, Flex, Translate } from './layout.types';
import { getStyle, toTranslateString } from './layout.utils';

export const AbsoluteFill = styled.div<BgColor>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${({ theme, bgColor }) => theme[bgColor || 'TRANSPARENT']};
`;

export const AbsoluteFullScreen = styled.div<BgColor & Flex>`
  width: ${SCREEN_WIDTH}px;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${({ theme, bgColor }) => theme[bgColor || 'TRANSPARENT']};
  align-items: ${({ alignItems }) => alignItems || 'flex-start'};
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-start'};
  -webkit-overflow-scrolling: touch;
  overflow: hidden;
`;

type AbsoluteStyle = {
  flexDirection?: 'row' | 'column';
  b?: number | string;
  t?: number | string;
  l?: number | string;
  r?: number | string;
  tl?: Translate;
};

export const Absolute = styled(LayoutBase)<AbsoluteStyle>`
  position: absolute;
  ${({ b, t, l, r, flexDirection, tl }) => css`
    ${getStyle('flex-direction', flexDirection || 'row')}
    ${getStyle('bottom', b)}
    ${getStyle('top', t)}
    ${getStyle('left', l)}
    ${getStyle('right', r)}
    ${toTranslateString(tl)}
  `}
`;
