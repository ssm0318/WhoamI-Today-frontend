import {
  BodyType,
  DisplayType,
  FontAttrs,
  FontSettings,
  FontType,
  FontWeight,
  TypoWeight,
} from './Font.types';

export const FontStyle: { [key in FontType]: FontAttrs } = {
  'head-line': {
    fontSize: 24,
    fontWeight: TypoWeight.MEDIUM,
  },
  'title-large': {
    fontSize: 20,
    fontWeight: TypoWeight.MEDIUM,
  },
  'title-medium': {
    fontSize: 16,
    fontWeight: TypoWeight.MEDIUM,
  },
  'title-small': {
    fontSize: 14,
    fontWeight: TypoWeight.MEDIUM,
  },
  'body-large': {
    fontSize: 16,
    fontWeight: TypoWeight.REGULAR,
  },
  'body-medium': {
    fontSize: 14,
    fontWeight: TypoWeight.REGULAR,
  },
  'body-small': {
    fontSize: 12,
    fontWeight: TypoWeight.REGULAR,
  },
  'button-large': {
    fontSize: 20,
    fontWeight: TypoWeight.REGULAR,
  },
  'button-medium': {
    fontSize: 16,
    fontWeight: TypoWeight.REGULAR,
  },
  'button-small': {
    fontSize: 14,
    fontWeight: TypoWeight.MEDIUM,
  },
  'label-large': {
    fontSize: 14,
    fontWeight: TypoWeight.MEDIUM,
  },
  'label-medium': {
    fontSize: 12,
    fontWeight: TypoWeight.MEDIUM,
  },
  'label-small': {
    fontSize: 10,
    fontWeight: TypoWeight.REGULAR,
  },
};

/**
 * @deprecated use TypoSettings
 * Display type의 font 값 setting
 */
export const DisplaySettings: { [key in DisplayType]: FontSettings } = {
  '24_bold': {
    fontSize: 24,
    fontWeight: FontWeight.BOLD,
    lineHeight: 1.4,
  },
  '24_regular': {
    fontSize: 24,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '20_bold': {
    fontSize: 20,
    fontWeight: FontWeight.BOLD,
    lineHeight: 1.4,
  },
  '18_bold': {
    fontSize: 18,
    fontWeight: FontWeight.BOLD,
    lineHeight: 1.4,
  },
  '14_regular': {
    fontSize: 14,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '14_semibold': {
    fontSize: 14,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
};

/**
 * @deprecated use TypoSettings
 * Body type의 font 값 setting
 */
export const BodySettings: { [key in BodyType]: FontSettings } = {
  '20_regular': {
    fontSize: 20,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '20_semibold': {
    fontSize: 20,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
  '18_regular': {
    fontSize: 18,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '18_semibold': {
    fontSize: 18,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
  '16_regular': {
    fontSize: 16,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '16_semibold': {
    fontSize: 16,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
  '14_regular': {
    fontSize: 14,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '14_semibold': {
    fontSize: 14,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
  '12_regular': {
    fontSize: 12,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '12_semibold': {
    fontSize: 12,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
  '11_regular': {
    fontSize: 11,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
  '11_semibold': {
    fontSize: 11,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
  '10_regular': {
    fontSize: 10,
    fontWeight: FontWeight.REGULAR,
    lineHeight: 1.4,
  },
};
