import { InputHTMLAttributes } from 'react';
import { Font } from '@design-system';
import CommonInput, { CommonInputProps } from './Input.styled';

export type InputProps = {
  label: string;
  labelType?: Font.BodyType;
} & CommonInputProps &
  InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  const { label = '', labelType = '18_regular', ...inputProps } = props;
  return (
    <>
      <Font.Body type={labelType}>{label}</Font.Body>
      <CommonInput {...inputProps} />
    </>
  );
}

export { Input };
