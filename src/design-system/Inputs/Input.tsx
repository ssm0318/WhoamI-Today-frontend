import { InputHTMLAttributes } from 'react';
import Font from '../Font/Font';
import CommonInput, { CommonInputProps } from './Input.styled';

export type InputProps = {
  label: string;
} & CommonInputProps &
  InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  const { label, ...inputProps } = props;
  return (
    <>
      <Font.Body type="18_regular">{label}</Font.Body>
      <CommonInput {...inputProps} />
    </>
  );
}

export default Input;
