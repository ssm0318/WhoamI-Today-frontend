import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Font, Typo } from '@design-system';
import { FontType, isDisplayType } from '../Font/Font.types';
import * as S from './Button.styled';
import {
  ButtonProps,
  ButtonSetting,
  DeprecatedButtonProps,
  DeprecatedButtonSetting,
} from './Button.types';
import { useButton } from './useButton';

/** @deprecated use <Button /> */
function DeprecatedButton(
  props: {
    size: keyof typeof deprecatedButtons;
  } & DeprecatedButtonProps,
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
const Large = React.memo((props: DeprecatedButtonProps) => (
  <DeprecatedButton {...props} size="Large" />
));

/** @deprecated */
const Small = React.memo((props: DeprecatedButtonProps) => (
  <DeprecatedButton {...props} size="Small" />
));

/** @deprecated */
const Medium = React.memo((props: DeprecatedButtonProps) => (
  <DeprecatedButton {...props} size="Medium" />
));

/** @deprecated */
const Dialog = React.memo((props: DeprecatedButtonProps) => (
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

function Button(
  props: {
    fontType?: FontType;
  } & ButtonProps,
) {
  const { to, width, fontType, ...buttonProps } = props;
  const { sizing } = buttonProps;
  const { text, color, outline, fill, status, ...handlers } = useButton(buttonProps);
  const { ButtonComponent, fontType: defaultFontType } = buttons[buttonProps.type];

  const buttonChildren = useMemo(() => {
    if (!text) return null;
    return (
      <ButtonComponent sizing={sizing} outline={outline} fill={fill} width={width}>
        <Typo type={fontType ?? defaultFontType} color={color} textAlign="center">
          {text}
        </Typo>
      </ButtonComponent>
    );
  }, [ButtonComponent, color, defaultFontType, fill, fontType, outline, sizing, text, width]);

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

const Primary = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="primary" />
));

const Secondary = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="secondary" />
));

const Tertiary = React.memo((props: Omit<ButtonProps, 'type'>) => (
  <Button {...props} type="tertiary" />
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
};

export { Dialog, Large, Medium, Primary, Secondary, Small, Tertiary };
