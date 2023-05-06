import React, { PropsWithChildren } from 'react';
import { ColorKeys } from '../colors';
import { Margin } from '../layouts';
import { BodySettings, DisplaySettings } from './Font.constants';
import * as S from './Font.styles';
import { BodyType, DisplayType } from './Font.types';

const Display: React.FC<PropsWithChildren<DisplayProps>> = React.memo((props) => {
  const { type, children, ...textProps } = props;
  return (
    <S.Font {...DisplaySettings[type]} {...textProps}>
      {children}
    </S.Font>
  );
});

const Body: React.FC<PropsWithChildren<BodyProps>> = React.memo((props) => {
  const { type, children, ...textProps } = props;

  return (
    <S.Font {...BodySettings[type]} {...textProps}>
      {children}
    </S.Font>
  );
});

export type TextPropsBase = {
  color?: ColorKeys;
  textAlign?: 'left' | 'center' | 'right';
  lineThrough?: boolean;
  underline?: boolean;
  numberOfLines?: number;
  pre?: boolean;
} & Margin;

export type DisplayProps = {
  type: DisplayType;
} & TextPropsBase;

export type BodyProps = {
  type: BodyType;
} & TextPropsBase;

/**
 * [Foundation] Font Display | Title | Body
 *
 * @prop {ColorKeys} color text color (default: 'GRAY_900')
 * @prop {string} type
 * @prop {'left' | 'center' | 'right'} textAlign (default: 'left')
 */

export default {
  Display,
  Body,
};
