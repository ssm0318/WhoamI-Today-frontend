import { ColorKeys } from '../colors';

export enum FontWeight {
  BOLD = 700,
  SEMIBOLD = 600,
  REGULAR = 400,
}

export type FontSettings = {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight: number;
  color?: ColorKeys;
  textAlign?: 'left' | 'right' | 'center';
};

export type DisplayType = '24_bold' | '20_bold' | '18_bold' | '14_regular' | '14_semibold';

export const isDisplayType = (font: unknown): font is DisplayType =>
  font === '24_bold' || font === '20_bold' || font === '18_bold' || font === '14_regular';

export type BodyType =
  | '20_regular'
  | '20_semibold'
  | '16_semibold'
  | '18_regular'
  | '18_semibold'
  | '14_regular'
  | '14_semibold'
  | '12_regular'
  | '12_semibold'
  | '10_regular';
