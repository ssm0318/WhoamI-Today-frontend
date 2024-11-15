import React, { ReactElement, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Font, Layout, Typo } from '@design-system';
import { FontType, isDisplayType } from '../Font/Font.types';
import * as S from './Button.styled';
import {
  ButtonComponentProps,
  ButtonSetting,
  DeprecatedButtonComponentProps,
  DeprecatedButtonSetting,
} from './Button.types';
import { useButton } from './useButton';

/** @deprecated use <Button /> */
function DeprecatedButton(
  props: {
    size: keyof typeof deprecatedButtons;
  } & DeprecatedButtonComponentProps,
) {
  const { size, to, width, ...buttonProps } = props;
  const { sizing } = buttonProps;
  const { text, color, outline, fill, status, ...handlers } = useButton(buttonProps);
  const { ButtonComponent, fontType } = deprecatedButtons[size];

  const buttonChildren = useMemo(() => {
    if (!text) return null;
    return (
      <ButtonComponent sizing={sizing} outline={outline} fill={fill} width={width}>
        {isDisplayType(fontType) ? (
          <Font.Display type={fontType} color={color} textAlign="center">
            {text}
          </Font.Display>
        ) : (
          <Font.Body type={fontType} color={color} textAlign="center">
            {text}
          </Font.Body>
        )}
      </ButtonComponent>
    );
  }, [ButtonComponent, color, fill, fontType, outline, sizing, text, width]);

  return (
    <S.Container sizing={sizing} disabled={status === 'completed' || status === 'disabled'}>
      {to ? (
        <Link to={to} {...handlers}>
          {buttonChildren}
        </Link>
      ) : (
        <button type="button" {...handlers}>
          {buttonChildren}
        </button>
      )}
    </S.Container>
  );
}

/** @deprecated */
const Large = React.memo((props: DeprecatedButtonComponentProps) => (
  <DeprecatedButton {...props} size="Large" />
));

/** @deprecated */
const Small = React.memo((props: DeprecatedButtonComponentProps) => (
  <DeprecatedButton {...props} size="Small" />
));

/** @deprecated */
const Medium = React.memo((props: DeprecatedButtonComponentProps) => (
  <DeprecatedButton {...props} size="Medium" />
));

/** @deprecated */
const Dialog = React.memo((props: DeprecatedButtonComponentProps) => (
  <DeprecatedButton {...props} size="Dialog" sizing="stretch" />
));

/** @deprecated */
const deprecatedButtons: DeprecatedButtonSetting = {
  Large: {
    ButtonComponent: S.LargeButton,
    fontType: '24_bold',
  },
  Medium: {
    ButtonComponent: S.MediumButton,
    fontType: '18_semibold',
  },
  Small: {
    ButtonComponent: S.SmallButton,
    fontType: '12_regular',
  },
  Dialog: {
    ButtonComponent: S.MediumButton,
    fontType: '14_regular',
  },
};

type ButtonProps = {
  fontType?: FontType;
  /**
   * icon 컴포넌트 위치
   */
  iconPosition?: 'left' | 'right';
  /**
   * SVGIcon 컴포넌트
   */
  icon?: ReactElement;
  className?: string;
} & ButtonComponentProps;

function Button(props: ButtonProps) {
  const { to, width, fontType, iconPosition = 'right', icon, className, ...buttonProps } = props;
  const { sizing } = buttonProps;
  const { text, color, outline, fill, status, ...handlers } = useButton(buttonProps);
  const { ButtonComponent, fontType: defaultFontType } = buttons[buttonProps.type];

  const buttonChildren = useMemo(() => {
    if (!text) return null;
    return (
      <ButtonComponent
        className="button_component"
        sizing={sizing}
        outline={outline}
        fill={fill}
        width={width}
      >
        <Layout.FlexRow gap={4} alignItems="center">
          {iconPosition === 'left' && icon}
          <Typo type={fontType ?? defaultFontType} color={color} textAlign="center">
            {text}
          </Typo>
          {iconPosition === 'right' && icon}
        </Layout.FlexRow>
      </ButtonComponent>
    );
  }, [
    ButtonComponent,
    color,
    defaultFontType,
    fill,
    fontType,
    icon,
    iconPosition,
    outline,
    sizing,
    text,
    width,
  ]);

  return (
    <S.Container
      className={className}
      sizing={sizing}
      disabled={status === 'completed' || status === 'disabled'}
    >
      {to ? (
        <Link to={to} {...handlers}>
          {buttonChildren}
        </Link>
      ) : (
        <button type="button" {...handlers}>
          {buttonChildren}
        </button>
      )}
    </S.Container>
  );
}

const Primary = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="primary" />
));

const Secondary = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="secondary" />
));

const Tertiary = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="tertiary" />
));

const Confirm = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="confirm" />
));

const Highlight = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="highlight" />
));

const buttons: ButtonSetting = {
  primary: {
    ButtonComponent: S.RoundButton,
    fontType: 'button-medium',
  },
  secondary: {
    ButtonComponent: S.RoundButton,
    fontType: 'button-medium',
  },
  tertiary: {
    ButtonComponent: S.UnderlineButton,
    fontType: 'button-small',
  },
  confirm: {
    ButtonComponent: S.ConfirmButton,
    fontType: 'button-medium',
  },
  highlight: {
    ButtonComponent: S.RoundButton,
    fontType: 'button-medium',
  },
};

export { Confirm, Dialog, Highlight, Large, Medium, Primary, Secondary, Small, Tertiary };
