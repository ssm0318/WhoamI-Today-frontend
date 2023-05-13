import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Font from '../Font/Font';
import * as S from './Button.styles';
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
    <S.Container sizing={sizing}>
      {to ? (
        <Link to={to} {...handlers}>
          {buttonChildren}
        </Link>
      ) : (
        <button type="button" {...handlers} disabled={status === 'disabled'}>
          {buttonChildren}
        </button>
      )}
    </S.Container>
  );
}

const Large = React.memo((props: ButtonProps) => <Button {...props} size="Large" />);

const buttons: ButtonSetting = {
  Large: {
    ButtonComponent: S.LargeButton,
    gap: 4,
    fontType: '18_semibold',
  },
};

export default { Large };
