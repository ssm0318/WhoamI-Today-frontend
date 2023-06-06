import { Font } from '@design-system';
import Input, { InputProps } from 'src/design-system/Inputs/Input';
import StyledValidatedInput from './ValidatedInput.styled';

type ValidatedInputProps = InputProps & {
  error?: string | null;
  guide?: string | null;
};

function ValidatedInput(props: ValidatedInputProps) {
  const { label, error, guide, ...inputProps } = props;

  return (
    <StyledValidatedInput>
      <Input label={label} {...inputProps} />
      {error && (
        <Font.Display type="14_regular" color="ERROR">
          {error}
        </Font.Display>
      )}
      {guide && !error && (
        <Font.Display type="14_regular" color="GRAY_4">
          {guide}
        </Font.Display>
      )}
    </StyledValidatedInput>
  );
}

export default ValidatedInput;
