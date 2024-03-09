import styled from 'styled-components';
import { CheckBox, ColorKeys } from '@design-system';

interface StyledSwipeButtonProps {
  backgroundColor: ColorKeys;
}

export const StyledSwipeButton = styled.button.attrs<StyledSwipeButtonProps>({
  type: 'button',
})<StyledSwipeButtonProps>`
  background-color: ${({ theme, backgroundColor }) => theme[backgroundColor]};
  width: 100%;
  height: 44px;
`;

export const StyledCheckBox = styled(CheckBox)`
  input {
    display: block;
    appearance: none;
    width: 20px;
    height: 20px;

    background-image: url('/icons/checkbox_default.svg');
    background-repeat: no-repeat;
    background-position: center left;
    background-size: contain;

    &:checked {
      border-color: transparent;
      background-image: url('/icons/checkbox_checked.svg');
    }
  }

  input + label,
  input:checked + label,
  .display-label {
    display: none;
  }
`;
