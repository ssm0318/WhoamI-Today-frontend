import { MouseEvent } from 'react';
import { ColorKeys } from '@design-system';
import { BodyType, DisplayType, FontType } from '../Font/Font.types';
import * as S from './Button.styled';

/** @deprecated */
export type ButtonSize = 'Large' | 'Medium' | 'Small' | 'Dialog';

/** @deprecated */
export type DeprecatedButtonSetting = {
  [key in ButtonSize]: {
    ButtonComponent: typeof S.LargeButton | typeof S.SmallButton | typeof S.MediumButton;
    fontType: BodyType | DisplayType;
  };
};

export type ButtonSetting = {
  [key in ButtonType]: {
    ButtonComponent: typeof S.RoundButton | typeof S.UnderlineButton;
    fontType: FontType;
  };
};

/** @deprecated */
export type DeprecatedButtonType = 'filled' | 'outlined' | 'white_fill' | 'gray_fill';
export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'confirm' | 'highlight';

export type ButtonStatus = 'normal' | 'hovered' | 'disabled' | 'completed';

type Colors = { background?: ColorKeys; outline?: ColorKeys; text: ColorKeys };

export type ButtonColorSetting = { [key in ButtonStatus]: Colors };

/** @deprecated */
export type DeprecatedButtonComponentProps = {
  type: DeprecatedButtonType;
  status: ButtonStatus;
  text: string;
  sizing?: 'fit-content' | 'stretch';
  onClick?: (e: MouseEvent) => void;
  /**
   * use axios Link component
   */
  to?: string;
  width?: number;
};

export type ButtonComponentProps = {
  type: ButtonType;
  status: ButtonStatus;
  text: string;
  sizing?: 'fit-content' | 'stretch';
  onClick?: (e: MouseEvent) => void;
  /**
   * use axios Link component
   */
  to?: string;
  width?: number;
};

export const AUTH_BUTTON_WIDTH = 186;
