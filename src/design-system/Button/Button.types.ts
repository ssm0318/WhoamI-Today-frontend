import { MouseEvent } from 'react';
import { ColorKeys } from '@design-system';
import { BodyType, DisplayType } from '../Font/Font.types';
import * as S from './Button.styled';

export type ButtonSize = 'Large' | 'Medium' | 'Small' | 'Dialog';

export type ButtonSetting = {
  [key in ButtonSize]: {
    ButtonComponent: typeof S.LargeButton | typeof S.SmallButton | typeof S.MediumButton;
    fontType: BodyType | DisplayType;
  };
};

export type ButtonType = 'filled' | 'outlined' | 'white_fill' | 'gray_fill';

export type ButtonStatus = 'normal' | 'hovered' | 'disabled' | 'completed';

type Colors = { background: ColorKeys; outline?: ColorKeys; text: ColorKeys };

export type ButtonColorSetting = { [key in ButtonStatus]: Colors };

export type ButtonProps = {
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
