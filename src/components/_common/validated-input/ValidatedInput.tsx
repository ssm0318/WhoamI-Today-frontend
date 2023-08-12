import { Font, Input, Layout, SvgIcon } from '@design-system';
import { ValidatedInputProps } from './ValidatedInput.helper';
import StyledValidatedInput from './ValidatedInput.styled';

function ValidatedInput(props: ValidatedInputProps) {
  const { error, guide, ...inputProps } = props;

  return (
    <StyledValidatedInput>
      <Input {...inputProps} />
      {error && (
        <Layout.FlexRow alignItems="center" mt={14}>
          <SvgIcon name="error" size={14} />
          <Font.Display type="14_regular" color="ERROR" ml={6}>
            {error}
          </Font.Display>
        </Layout.FlexRow>
      )}
      {guide && !error && (
        <Font.Display type="14_regular" color="GRAY_4" mt={18}>
          {guide}
        </Font.Display>
      )}
    </StyledValidatedInput>
  );
}

export default ValidatedInput;
