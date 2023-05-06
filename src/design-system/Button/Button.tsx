import React from 'react';
import Font from '../Font/Font';
import * as S from './Button.styles';
import { ButtonProps, ButtonSetting } from './Button.types';
import { useButton } from './useButton';

function Button(
  props: {
    size: keyof typeof buttons;
  } & ButtonProps,
) {
  const { size, ...buttonProps } = props;
  const { sizing } = buttonProps;
  const { text, color, outline, fill, ...handlers } = useButton(buttonProps);
  const { ButtonComponent, fontType } = buttons[size];
  return (
    <S.Container sizing={sizing}>
      <button type="button" {...handlers}>
        <ButtonComponent sizing={sizing} outline={outline} fill={fill}>
          {!!text && (
            <Font.Body type={fontType} color={color} textAlign="center">
              {text}
            </Font.Body>
          )}
        </ButtonComponent>
      </button>
    </S.Container>
  );
}

const Large = React.memo((props: ButtonProps) => <Button {...props} size="Large" />);

const buttons: ButtonSetting = {
  Large: {
    ButtonComponent: S.LargeButton,
    gap: 4,
    fontType: '12_regular',
  },
};

export default { Large };
