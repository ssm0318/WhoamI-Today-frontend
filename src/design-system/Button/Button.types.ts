import { ColorKeys } from 'src/design-system/colors';
import { BodyType } from '../Font/Font.types';
import * as S from './Button.styled';

export type ButtonSize = 'Large' | 'Medium' | 'Small' | 'Dialog';

export type ButtonSetting = {
  [key in ButtonSize]: {
    ButtonComponent: typeof S.LargeButton | typeof S.SmallButton | typeof S.MediumButton;
    fontType: BodyType;
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
  onClick?: () => void;
  /**
   * use axios Link component
   */
  to?: string;
};
