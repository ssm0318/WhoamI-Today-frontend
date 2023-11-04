// 추후에 color 코드 확정되면 여기에 추가
export const Colors = {
  BASIC_BLACK: '#000000',
  BASIC_WHITE: '#FFFFFF',

  BASIC_DISABLED_SOFT: '#EEEEEE',
  BASIC_DISABLED_DEEP: '#DDDDDD',

  SYSTEM_ERROR: '#BF0000',
  SYSTEM_SUCCESS: '#1FB881',

  GRAY_1: '#D6D6D6',
  GRAY_2: '#D9D9D9',
  GRAY_3: '#555555',
  GRAY_4: '#585858',
  GRAY_5: '#B5B5B5',
  GRAY_6: '#303030',
  GRAY_7: '#ECEBEC',
  GRAY_8: '#515151',
  GRAY_9: '#6A6A6A',
  GRAY_10: '#EBEBEB',
  GRAY_11: '#CDCDCD',
  GRAY_12: '#A0A0A0',
  GRAY_13: '#3F3F3F',
  GRAY_14: '#F6F6F6',

  CALENDAR_TODAY: '#FF8754',

  BACKGROUND_COLOR: '#F5F5F5',

  RESPONSE_INPUT_DIVIDER: '#A4B4F3',

  TRANSPARENT: 'transparent',
  DIM: '#000000b3',

  ERROR: '#FF2D2D',

  ANCHOR: '#0000FF',

  NUDGE: '#FF6D00',

  PRIMARY: '#8700FF',
  SECONDARY: '#87DFFF',

  AVAILABLE_BG: '#7EC7FC33',
  AVAILABLE_CHIP: '#4DB4FF',
  NO_STATUS_BG: '#FFC70033',
  NO_STATUS_CHIP: '#FFC700',
  MAYBE_SLOW_BG: '#FF875433',
  MAYBE_SLOW_CHIP: '#FF8754',
  NOT_AVAILABLE_BG: '#FF2D2D33',
  NOT_AVAILABLE_CHIP: '#FF2D2D',

  SPOTIFY_GREEN: '#4AD159',
};

export type ColorType = typeof Colors;
export type ColorKeys = keyof ColorType;
