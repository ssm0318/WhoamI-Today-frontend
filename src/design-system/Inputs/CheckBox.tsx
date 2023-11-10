import { InputHTMLAttributes } from 'react';
import { Margin } from '../layouts';
import { StyledCheckBox, StyledCheckCircle } from './CheckBox.styled';

type Props = InputHTMLAttributes<HTMLInputElement> &
  Margin & {
    hideLabel?: boolean;
  };

function CheckInput(props: Props) {
  const { name, hideLabel } = props;
  return (
    <>
      <input id={name} type="checkbox" {...props} />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={name} />
      {!hideLabel && (
        <label className="display-label" htmlFor={name}>
          {name}
        </label>
      )}
    </>
  );
}

export function CheckBox(props: Props) {
  return (
    <StyledCheckBox>
      <CheckInput {...props} />
    </StyledCheckBox>
  );
}

export function CheckCircle(props: Props) {
  return (
    <StyledCheckCircle>
      <CheckInput {...props} />
    </StyledCheckCircle>
  );
}
