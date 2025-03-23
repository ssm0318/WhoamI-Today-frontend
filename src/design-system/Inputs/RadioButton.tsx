import { InputHTMLAttributes } from 'react';
import { Typo } from '../Font';
import { Margin } from '../layouts';
import { StyledRadioButton } from './RadioButton.styled';

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement>, Margin {
  label?: string;
  labelType?: 'label-large' | 'label-medium';
  buttonSize?: 'small' | 'medium';
}

export function RadioButton({
  label,
  className,
  disabled,
  name,
  labelType = 'label-large',
  buttonSize = 'medium',
  ...props
}: RadioButtonProps) {
  return (
    <StyledRadioButton className={className} disabled={disabled} size={buttonSize}>
      <label htmlFor={name}>
        <input type="radio" id={name} disabled={disabled} name={name} {...props} />
        <Typo type={labelType}>{label}</Typo>
      </label>
    </StyledRadioButton>
  );
}
