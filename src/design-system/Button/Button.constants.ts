import { ButtonColorSetting, ButtonType, DeprecatedButtonType } from './Button.types';

export const buttonColorSettings: {
  [key in DeprecatedButtonType | ButtonType]: ButtonColorSetting;
} = {
  /** @deprecated */
  white_fill: {
    normal: { background: 'WHITE', text: 'BLACK', outline: 'GRAY_1' },
    hovered: { background: 'WHITE', text: 'BLACK', outline: 'GRAY_1' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP', outline: 'GRAY_1' },
    completed: { background: 'WHITE', text: 'BLACK', outline: 'GRAY_1' },
  },
  /** @deprecated */
  gray_fill: {
    normal: { background: 'LIGHT_GRAY', text: 'GRAY_13', outline: 'LIGHT_GRAY' },
    hovered: { background: 'LIGHT_GRAY', text: 'GRAY_13', outline: 'LIGHT_GRAY' },
    disabled: { background: 'BASIC_DISABLED_SOFT', text: 'BASIC_DISABLED_DEEP' },
    completed: { background: 'LIGHT_GRAY', text: 'GRAY_13', outline: 'LIGHT_GRAY' },
  },
  /** @deprecated */
  filled: {
    normal: { background: 'BLACK', text: 'WHITE' },
    hovered: { background: 'BLACK', text: 'WHITE' },
    disabled: {
      background: 'BASIC_DISABLED_SOFT',
      text: 'BASIC_DISABLED_DEEP',
    },
    completed: { background: 'BLACK', text: 'WHITE' },
  },
  /** @deprecated */
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
  primary: {
    normal: { background: 'DARK', text: 'WHITE' },
    hovered: { background: 'DARK', text: 'WHITE' },
    disabled: { background: 'LIGHT_GRAY', text: 'MEDIUM_GRAY' },
    completed: { background: 'MEDIUM_GRAY', text: 'WHITE' },
  },
  secondary: {
    normal: { background: 'WHITE', text: 'DARK', outline: 'DARK_GRAY' },
    hovered: { background: 'WHITE', text: 'DARK', outline: 'DARK_GRAY' },
    disabled: { background: 'WHITE', text: 'MEDIUM_GRAY', outline: 'LIGHT_GRAY' },
    completed: { background: 'WHITE', text: 'DARK', outline: 'DARK_GRAY' },
  },
  tertiary: {
    normal: { text: 'DARK' },
    hovered: { text: 'DARK' },
    disabled: { text: 'MEDIUM_GRAY' },
    completed: { text: 'DARK' },
  },
  confirm: {
    normal: { background: 'SECONDARY', text: 'BLACK' },
    hovered: { background: 'SECONDARY', text: 'BLACK' },
    disabled: { background: 'LIGHT_GRAY', text: 'MEDIUM_GRAY' },
    completed: { background: 'MEDIUM_GRAY', text: 'WHITE' },
  },
  highlight: {
    normal: { background: 'PRIMARY', text: 'WHITE' },
    hovered: { background: 'PRIMARY', text: 'WHITE' },
    disabled: { background: 'LIGHT_GRAY', text: 'MEDIUM_GRAY' },
    completed: { background: 'MEDIUM_GRAY', text: 'WHITE' },
  },
};
