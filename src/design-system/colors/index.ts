// 추후에 color 코드 확정되면 여기에 추가
export const Colors = {
  PRIMARY: '#8700FF',
  SECONDARY: '#87DFFF',
  TERTIARY_PINK: '#FF00A8',
  TERTIARY_BLUE: '#0047FF',
  TERTIARY_GREEN: '#04D100',
  WARNING: '#FF3B30',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  /**
   * @deprecated
   */
  BASIC_DISABLED_SOFT: '#EEEEEE',
  /**
   * @deprecated
   */
  BASIC_DISABLED_DEEP: '#DDDDDD',

  /**
   * @deprecated
   */
  SYSTEM_ERROR: '#BF0000',
  /**
   * @deprecated
   */
  SYSTEM_SUCCESS: '#1FB881',
  /**
   * @deprecated
   */
  GRAY_1: '#D6D6D6',
  /**
   * @deprecated use  LIGHT_GRAY
   */
  GRAY_2: '#D9D9D9',
  /**
   * @deprecated use DARK_GRAY
   */
  GRAY_3: '#555555',
  /**
   * @deprecated
   */ GRAY_4: '#585858',
  /**
   * @deprecated
   */
  GRAY_5: '#B5B5B5',
  /**
   * @deprecated use  DARK
   */
  GRAY_6: '#303030',
  /**
   * @deprecated use  LIGHT
   */
  GRAY_7: '#ECEBEC',
  /**
   * @deprecated
   */
  GRAY_8: '#515151',
  /**
   * @deprecated
   */
  GRAY_9: '#6A6A6A',
  /**
   * @deprecated
   */
  GRAY_10: '#EBEBEB',
  /**
   * @deprecated
   */
  GRAY_11: '#CDCDCD',
  /**
   * @deprecated use MEDIUM_GRAY
   */
  GRAY_12: '#A0A0A0',
  /**
   * @deprecated
   */
  GRAY_13: '#3F3F3F',
  /**
   * @deprecated
   */
  GRAY_14: '#F6F6F6',
  /**
   * @deprecated
   */
  CALENDAR_TODAY: '#FF8754',
  /**
   * @deprecated
   */
  BACKGROUND_COLOR: '#F5F5F5',
  /**
   * @deprecated
   */
  RESPONSE_INPUT_DIVIDER: '#A4B4F3',
  /**
   * @deprecated
   */
  TRANSPARENT: 'transparent',
  /**
   * @deprecated
   */
  DIM: '#000000b3',
  /**
   * @deprecated
   */
  ERROR: '#FF2D2D',
  /**
   * @deprecated
   */
  ANCHOR: '#0000FF',
  /**
   * @deprecated
   */
  NUDGE: '#FF6D00',

  /**
   * @deprecated
   */
  AVAILABLE_BG: '#7EC7FC33',
  /**
   * @deprecated
   */
  AVAILABLE_CHIP: '#4DB4FF',
  /**
   * @deprecated
   */
  NO_STATUS_BG: '#FFC70033',
  /**
   * @deprecated
   */
  NO_STATUS_CHIP: '#FFC700',
  /**
   * @deprecated
   */
  MAYBE_SLOW_BG: '#FF875433',
  /**
   * @deprecated
   */
  MAYBE_SLOW_CHIP: '#FF8754',
  /**
   * @deprecated
   */
  NOT_AVAILABLE_BG: '#FF2D2D33',
  /**
   * @deprecated
   */
  NOT_AVAILABLE_CHIP: '#FF2D2D',
  /**
   * @deprecated
   */
  SPOTIFY_GREEN: '#4AD159',
};

export type ColorType = typeof Colors;
export type ColorKeys = keyof ColorType;
