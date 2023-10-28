import { BodyType, DisplayType, FontSettings, FontWeight } from './Font.types';

/**
 * Display type의 font 값 setting
 */
export const DisplaySettings: { [key in DisplayType]: FontSettings } = {
  '24_bold': {
    fontSize: 24,
    fontWeight: FontWeight.BOLD,
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
  '10_regular': {
    fontSize: 10,
    fontWeight: FontWeight.SEMIBOLD,
    lineHeight: 1.4,
  },
};
