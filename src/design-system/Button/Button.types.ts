import { ColorKeys } from 'src/design-system/colors';
import { BodyType } from '../Font/Font.types';
import * as S from './Button.styles';

export type ButtonSize = 'Large';

export type ButtonSetting = {
  [key in ButtonSize]: {
    ButtonComponent: typeof S.LargeButton;
    gap: number;
    fontType: BodyType;
  };
};

export type ButtonType = 'filled' | 'outlined' | 'white_fill';

export type ButtonStatus = 'normal' | 'pressed' | 'disabled' | 'completed';

type Colors = { background: ColorKeys; outline?: ColorKeys; text: ColorKeys };

export type ButtonColorSetting = { [key in ButtonStatus]: Colors };

export type ButtonProps = {
  type: ButtonType;
  status: ButtonStatus;
  text: string;
  sizing?: 'fit-content' | 'stretch';
  onClick?: () => void;
};
