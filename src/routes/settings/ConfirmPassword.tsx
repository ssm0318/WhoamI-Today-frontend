import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout } from '@design-system';
import { confirmPassword } from '@utils/apis/user';

function ConfirmPassword() {
  const [t] = useTranslation('translation');

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const navigate = useNavigate();
  const handleClickConfirm = () => {
    confirmPassword({
      password: passwordInput,
      onSuccess: () => navigate('/settings/reset-password'),
      onError: (e) => setPasswordError(e),
    });
  };

  return (
    <MainContainer>
      <SubHeader title={t('settings.confirm_password')} typo="title-large" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={10} ph={24}>
        <ValidatedPasswordInput
          label={t('settings.enter_your_current_password')}
          name="password"
          value={passwordInput}
          onChange={handleChange}
          error={passwordError}
          guide={t('sign_up.password_constraints')}
        />
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b={`${BOTTOM_TABBAR_HEIGHT + 50}px`} ph={24} flexDirection="column">
        <Button.Large
          type="filled"
          status="normal"
          sizing="stretch"
          text={t('settings.confirm')}
          onClick={handleClickConfirm}
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default ConfirmPassword;
