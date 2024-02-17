import { Input, Layout, SvgIcon, Typo } from '@design-system';
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
          <Typo type="label-small" color="ERROR" ml={6}>
            {error}
          </Typo>
        </Layout.FlexRow>
      )}
      {guide && !error && (
        <Typo type="label-small" color="DARK_GRAY" mt={18}>
          {guide}
        </Typo>
      )}
    </StyledValidatedInput>
  );
}

export default ValidatedInput;
