import styled, { css } from 'styled-components';
import { getStyle } from 'src/design-system/layouts/layout.utils';
import { LayoutBase } from './Flex';

type Translate = (number | string)[];

type FixedStyle = {
  b?: number | string;
  t?: number | string;
  l?: number | string;
  r?: number | string;
  tl?: Translate;
};

export const Fixed = styled(LayoutBase)<FixedStyle>`
  position: fixed;
  ${({ b, t, l, r, tl }) => css`
    ${getStyle('bottom', b)}
    ${getStyle('top', t)}
    ${getStyle('left', l)}
    ${getStyle('right', r)}
    ${toTranslateString(tl)}
  `}
`;

export const toTranslateString = (translate?: Translate) => {
  if (!translate) return '';
  const [x, y] = translate;
  const translateX = typeof x === 'number' ? `${x}px` : x;
  const translateY = typeof y === 'number' ? `${y}px` : y;
  return `transform: translate(${translateX}, ${translateY})`;
};
