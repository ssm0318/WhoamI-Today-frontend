import { InputHTMLAttributes } from 'react';
import CommonInput, { InputProps } from 'src/design-system/Inputs/Input.styled';
import StyledValidatedInput from './ValidatedInput.styled';

type ValidatedInputProps = InputHTMLAttributes<HTMLInputElement> &
  InputProps & {
    error: string | null;
    guide?: string | null;
  };

function ValidatedInput(props: ValidatedInputProps) {
  const { error, guide, ...inputProps } = props;

  return (
    <StyledValidatedInput>
      <CommonInput {...inputProps} />
      {error && <span className="error">{error}</span>}
      {guide && !error && <span>{guide}</span>}
    </StyledValidatedInput>
  );
}

export default ValidatedInput;
