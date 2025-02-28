import { InputHTMLAttributes } from 'react';
import { Typo } from '../Font';
import { Margin } from '../layouts';
import { StyledRadioButton } from './RadioButton.styled';

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement>, Margin {
  label?: string;
}

export function RadioButton({ label, className, disabled, name, ...props }: RadioButtonProps) {
  return (
    <StyledRadioButton className={className} disabled={disabled}>
      <label htmlFor={name}>
        <input type="radio" id={name} disabled={disabled} name={name} {...props} />
        <Typo type="label-large">{label}</Typo>
      </label>
    </StyledRadioButton>
  );
}
