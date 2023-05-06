import { ButtonColorSetting, ButtonType } from './Button.types';

export const buttonColorSettings: { [key in ButtonType]: ButtonColorSetting } = {
  white_fill: {
    normal: { background: 'BASIC_WHITE', text: 'BASIC_BLACK' },
    pressed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK' },
    disabled: { background: 'BASIC_WHITE', text: 'BASIC_BLACK' },
    completed: { background: 'BASIC_WHITE', text: 'BASIC_BLACK' },
  },
};
