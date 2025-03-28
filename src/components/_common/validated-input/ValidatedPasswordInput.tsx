import { useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import { Font, Input, Layout, SvgIcon } from '@design-system';
import { ValidatedInputProps } from './ValidatedInput.helper';
import StyledValidatedInput from './ValidatedInput.styled';

function ValidatedPasswordInput(props: ValidatedInputProps) {
  const { error, guide, ...inputProps } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledValidatedInput>
      <Input type={showPassword ? 'text' : 'password'} {...inputProps} />
      <Icon
        onClick={handleToggleShowPassword}
        name={showPassword ? 'hide_false' : 'hide_true'}
        size={36}
      />
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

export default ValidatedPasswordInput;
