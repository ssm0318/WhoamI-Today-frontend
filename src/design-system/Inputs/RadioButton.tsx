import { InputHTMLAttributes, useId } from 'react';
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
  const id = useId();
  return (
    <StyledRadioButton className={className} disabled={disabled} size={buttonSize}>
      <label htmlFor={id}>
        <input type="radio" id={id} disabled={disabled} name={name} {...props} />
        <Typo type={labelType}>{label}</Typo>
      </label>
    </StyledRadioButton>
  );
}
