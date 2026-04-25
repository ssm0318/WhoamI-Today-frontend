import { InputHTMLAttributes, ReactNode } from 'react';
import { Margin } from '../layouts';
import { StyledRectCheckBox } from './CheckBox.styled';

interface CheckBoxOwnProps {
  label?: ReactNode;
}

export function CheckBox(props: InputHTMLAttributes<HTMLInputElement> & Margin & CheckBoxOwnProps) {
  const { name, className, disabled, label, ...inputProps } = props;
  return (
    <StyledRectCheckBox className={className} disabled={disabled}>
      <input id={name} type="checkbox" name={name} disabled={disabled} {...inputProps} />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={name} />
      <label className="display-label" htmlFor={name}>
        {label ?? name}
      </label>
    </StyledRectCheckBox>
  );
}
