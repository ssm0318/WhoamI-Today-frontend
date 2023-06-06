import { InputHTMLAttributes } from 'react';
import Font from '../Font/Font';
import CommonInput, { InputProps } from './Input.styled';

export type SignUpInputProps = {
  label: string;
} & InputProps &
  InputHTMLAttributes<HTMLInputElement>;

function SignUpInput(props: SignUpInputProps) {
  const { label, ...inputProps } = props;
  return (
    <>
      <Font.Body type="18_regular" mb={24}>
        {label}
      </Font.Body>
      <CommonInput {...inputProps} />
    </>
  );
}

export default SignUpInput;
