import { ButtonColorSetting, ButtonType } from './Button.types';

export const buttonColorSettings: { [key in ButtonType]: ButtonColorSetting } = {
  white_fill: {
    normal: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'GRAY_1' },
    hovered: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'GRAY_1' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP', outline: 'GRAY_1' },
    completed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'GRAY_1' },
  },
  gray_fill: {
    normal: { background: 'GRAY_2', text: 'GRAY_13', outline: 'GRAY_2' },
    hovered: { background: 'GRAY_2', text: 'GRAY_13', outline: 'GRAY_2' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'GRAY_2', text: 'GRAY_13', outline: 'GRAY_2' },
  },
  filled: {
    normal: { background: 'BASIC_BLACK', text: 'BASIC_WHITE' },
    hovered: { background: 'BASIC_BLACK', text: 'BASIC_WHITE' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
    },
    completed: { background: 'BASIC_BLACK', text: 'BASIC_WHITE' },
  },
  warning_fill: {
    normal: { background: 'WARNING', text: 'BASIC_WHITE' },
    hovered: { background: 'WARNING', text: 'BASIC_WHITE' },
    disabled: { background: 'WARNING', text: 'BASIC_WHITE' },
    completed: { background: 'WARNING', text: 'BASIC_WHITE' },
  },
  secondary_fill: {
    normal: { background: 'SECONDARY', text: 'BASIC_BLACK' },
    hovered: { background: 'SECONDARY', text: 'BASIC_BLACK' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_WHITE' },
    completed: { background: 'SECONDARY', text: 'BASIC_WHITE' },
  },
  outlined: {
    normal: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'BASIC_BLACK' },
    hovered: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'BASIC_BLACK' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
      outline: 'BASIC_BLACK',
    },
    completed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'BASIC_BLACK' },
  },
};
