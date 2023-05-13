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

  BACKGROUND_COLOR: '#F5F5F5',

  TRANSPARENT: 'transparent',
  DIM: '#000000b3',
};

export type ColorType = typeof Colors;
export type ColorKeys = keyof ColorType;
