import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Font from '../Font/Font';
import * as S from './Button.styled';
import { ButtonProps, ButtonSetting } from './Button.types';
import { useButton } from './useButton';

function Button(
  props: {
    size: keyof typeof buttons;
  } & ButtonProps,
) {
  const { size, to, ...buttonProps } = props;
  const { sizing } = buttonProps;
  const { text, color, outline, fill, status, ...handlers } = useButton(buttonProps);
  const { ButtonComponent, fontType } = buttons[size];

  const buttonChildren = useMemo(
    () => (
      <ButtonComponent sizing={sizing} outline={outline} fill={fill}>
        {!!text && (
          <Font.Body type={fontType} color={color} textAlign="center">
            {text}
          </Font.Body>
        )}
      </ButtonComponent>
    ),
    [ButtonComponent, color, fill, fontType, outline, sizing, text],
  );

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

const Large = React.memo((props: ButtonProps) => <Button {...props} size="Large" />);

const Small = React.memo((props: ButtonProps) => <Button {...props} size="Small" />);

const Medium = React.memo((props: ButtonProps) => <Button {...props} size="Medium" />);

const Dialog = React.memo((props: ButtonProps) => (
  <Button {...props} size="Dialog" sizing="stretch" />
));

const buttons: ButtonSetting = {
  Large: {
    ButtonComponent: S.LargeButton,
    fontType: '12_regular',
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

export default { Large, Medium, Small, Dialog };
