import { DEFAULT_MARGIN } from '@constants/layout';
import { DefaultOrNumber, Translate } from './layout.types';

export const toPx = (value: 'default' | number) => (value === 'default' ? DEFAULT_MARGIN : value);

export const toMarginPaddingString = (
  ...[all = 0, h = 0, v = 0, t = 0, r = 0, b = 0, l = 0]: (DefaultOrNumber | undefined)[]
) => {
  const top = toPx(t) || toPx(v) || toPx(all);
  const right = toPx(r) || toPx(h) || toPx(all);
  const bottom = toPx(b) || toPx(v) || toPx(all);
  const left = toPx(l) || toPx(h) || toPx(all);
  return `${top}px ${right}px ${bottom}px ${left}px;`;
};

export const getStyle = (key: string, value: number | undefined | string) => {
  if (value === undefined) return '';
  if (key === 'z-index') return `${key}: ${value};`;
  if (typeof value === 'number') return `${key}: ${value}px;`;
  return `${key}: ${value};`;
};

export const toTranslateString = (translate?: Translate) => {
  if (!translate) return '';
  const [x, y] = translate;
  const translateX = typeof x === 'number' ? `${x}px` : x;
  const translateY = typeof y === 'number' ? `${y}px` : y;
  return `transform: translate(${translateX}, ${translateY})`;
};
