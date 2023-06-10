import { InputHTMLAttributes } from 'react';
import Font from '../Font/Font';
import { BodyType } from '../Font/Font.types';
import CommonInput, { CommonInputProps } from './Input.styled';

export type InputProps = {
  label: string;
  labelType?: BodyType;
} & CommonInputProps &
  InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  const { label, labelType = '18_regular', ...inputProps } = props;
  return (
    <>
      <Font.Body type={labelType}>{label}</Font.Body>
      <CommonInput {...inputProps} />
    </>
  );
}

export default Input;
