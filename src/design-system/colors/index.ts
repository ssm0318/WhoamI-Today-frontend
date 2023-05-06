export const Colors = {
  BASIC_BLACK: '#000000',
  BASIC_WHITE: '#FFFFFF',

  SYSTEM_ERROR: '#BF0000',
  SYSTEM_SUCCESS: '#1FB881',

  TRANSPARENT: 'transparent',
  DIM: '#000000b3',
};

export type ColorType = typeof Colors;
export type ColorKeys = keyof ColorType;
