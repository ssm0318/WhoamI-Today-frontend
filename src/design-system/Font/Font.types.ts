import { ColorKeys } from '../colors';

/**
 * @deprecated use TypoFontWeight
 */
export enum FontWeight {
  BOLD = 700,
  SEMIBOLD = 600,
  REGULAR = 400,
}

export enum TypoWeight {
  MEDIUM = 500,
  REGULAR = 400,
}
/**
 * @deprecated use TypoSettings
 */
export type FontSettings = {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight: number;
  color?: ColorKeys;
  textAlign?: 'left' | 'right' | 'center';
};

export type FontAttrs = {
  fontSize: number;
  fontWeight: TypoWeight;
};

/**
 * @deprecated use Typo
 */
export type DisplayType =
  | '24_regular'
  | '24_bold'
  | '20_bold'
  | '18_bold'
  | '14_regular'
  | '14_semibold';

/**
 * @deprecated use TypoType
 * @param font
 * @returns
 */
export const isDisplayType = (font: unknown): font is DisplayType =>
  font === '24_bold' || font === '20_bold' || font === '18_bold' || font === '14_regular';

/**
 * @deprecated use Typo
 */
export type BodyType =
  | '20_regular'
  | '20_semibold'
  | '16_semibold'
  | '18_regular'
  | '18_semibold'
  | '16_regular'
  | '16_semibold'
  | '14_regular'
  | '14_semibold'
  | '12_regular'
  | '12_semibold'
  | '11_regular'
  | '11_semibold'
  | '10_regular';

export type FontType =
  | 'head-line'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'button-large'
  | 'button-medium'
  | 'button-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';
