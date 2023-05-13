import { ButtonColorSetting, ButtonType } from './Button.types';

export const buttonColorSettings: { [key in ButtonType]: ButtonColorSetting } = {
  white_fill: {
    normal: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'GRAY_1' },
    pressed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK' },
  },
  filled: {
    normal: { background: 'BASIC_BLACK', text: 'BASIC_WHITE' },
    pressed: { background: 'BASIC_BLACK', text: 'BASIC_WHITE' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'BASIC_BLACK', text: 'BASIC_WHITE' },
  },
  outlined: {
    normal: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'BASIC_BLACK' },
    pressed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'BASIC_BLACK' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK', outline: 'BASIC_BLACK' },
  },
};
