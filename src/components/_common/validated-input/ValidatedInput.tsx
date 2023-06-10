import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';
import Input, { InputProps } from 'src/design-system/Inputs/Input';
import StyledValidatedInput from './ValidatedInput.styled';

type ValidatedInputProps = InputProps & {
  error?: string | null;
  guide?: string | null;
};

function ValidatedInput(props: ValidatedInputProps) {
  const { label, error, guide, name, type, ...inputProps } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledValidatedInput>
      <Input
        label={label}
        name={name}
        // eslint-disable-next-line no-nested-ternary
        type={type !== 'password' ? type : showPassword ? 'text' : 'password'}
        {...inputProps}
      />
      {(name === 'password' || type === 'password') && (
        <button type="button" onClick={handleToggleShowPassword} name="password-toggle">
          <SvgIcon name={showPassword ? 'hide_password_eye' : 'show_password_eye'} size={20} />
        </button>
      )}
      {error && (
        <Layout.FlexRow alignItems="center" mt={14}>
          <SvgIcon name="error" size={14} />
          <Font.Display type="14_regular" color="ERROR" ml={6}>
            {error}
          </Font.Display>
        </Layout.FlexRow>
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
