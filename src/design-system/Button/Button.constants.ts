import { ButtonColorSetting, ButtonType } from './Button.types';

export const buttonColorSettings: { [key in ButtonType]: ButtonColorSetting } = {
  white_fill: {
    normal: { background: 'BASIC_WHITE', text: 'BLACK', outline: 'GRAY_1' },
    hovered: { background: 'BASIC_WHITE', text: 'BLACK', outline: 'GRAY_1' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP', outline: 'GRAY_1' },
    completed: { background: 'BASIC_WHITE', text: 'BLACK', outline: 'GRAY_1' },
  },
  gray_fill: {
    normal: { background: 'GRAY_2', text: 'GRAY_13', outline: 'GRAY_2' },
    hovered: { background: 'GRAY_2', text: 'GRAY_13', outline: 'GRAY_2' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'GRAY_2', text: 'GRAY_13', outline: 'GRAY_2' },
  },
  filled: {
    normal: { background: 'BLACK', text: 'BASIC_WHITE' },
    hovered: { background: 'BLACK', text: 'BASIC_WHITE' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
    },
    completed: { background: 'BLACK', text: 'BASIC_WHITE' },
  },
  outlined: {
    normal: { background: 'BASIC_WHITE', text: 'BLACK', outline: 'BLACK' },
    hovered: { background: 'BASIC_WHITE', text: 'BLACK', outline: 'BLACK' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
      outline: 'BLACK',
    },
    completed: { background: 'BASIC_WHITE', text: 'BLACK', outline: 'BLACK' },
  },
};
