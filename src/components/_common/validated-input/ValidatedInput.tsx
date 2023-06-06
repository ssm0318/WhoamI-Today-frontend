import { Font } from '@design-system';
import SignUpInput, { SignUpInputProps } from 'src/design-system/Inputs/SignUpInput';
import StyledValidatedInput from './ValidatedInput.styled';

type ValidatedInputProps = SignUpInputProps & {
  error: string | null;
  guide?: string | null;
};

function ValidatedInput(props: ValidatedInputProps) {
  const { label, error, guide, ...inputProps } = props;

  return (
    <StyledValidatedInput>
      <SignUpInput label={label} {...inputProps} />
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
