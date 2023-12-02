import { ButtonColorSetting, ButtonType } from './Button.types';

export const buttonColorSettings: { [key in ButtonType]: ButtonColorSetting } = {
  white_fill: {
    normal: { background: 'WHITE', text: 'BLACK', outline: 'GRAY_1' },
    hovered: { background: 'WHITE', text: 'BLACK', outline: 'GRAY_1' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP', outline: 'GRAY_1' },
    completed: { background: 'WHITE', text: 'BLACK', outline: 'GRAY_1' },
  },
  gray_fill: {
    normal: { background: 'LIGHT_GRAY', text: 'GRAY_13', outline: 'LIGHT_GRAY' },
    hovered: { background: 'LIGHT_GRAY', text: 'GRAY_13', outline: 'LIGHT_GRAY' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'LIGHT_GRAY', text: 'GRAY_13', outline: 'LIGHT_GRAY' },
  },
  filled: {
    normal: { background: 'BLACK', text: 'WHITE' },
    hovered: { background: 'BLACK', text: 'WHITE' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
    },
    completed: { background: 'BLACK', text: 'WHITE' },
  },
  outlined: {
    normal: { background: 'WHITE', text: 'BLACK', outline: 'BLACK' },
    hovered: { background: 'WHITE', text: 'BLACK', outline: 'BLACK' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
      outline: 'BLACK',
    },
    completed: { background: 'WHITE', text: 'BLACK', outline: 'BLACK' },
  },
};
