import { InputHTMLAttributes } from 'react';
import CommonInput, { InputProps } from 'src/design-system/Inputs/Input.styled';
import StyledValidatedInput from './ValidatedInput.styled';

type ValidatedInputProps = InputHTMLAttributes<HTMLInputElement> &
  InputProps & {
    error: string | null;
  };

function ValidatedInput(props: ValidatedInputProps) {
  const { error, ...inputProps } = props;

  return (
    <StyledValidatedInput>
      <CommonInput {...inputProps} />
      {error && <span>{error}</span>}
    </StyledValidatedInput>
  );
}

export default ValidatedInput;
