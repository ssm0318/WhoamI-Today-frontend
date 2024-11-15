import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
    <>
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
      <Layout.Fixed l={0} b={20 + BOTTOM_TABBAR_HEIGHT} w="100%" alignItems="center" ph="default">
        <Button.Confirm
          status="normal"
          sizing="stretch"
          text={t('settings.confirm')}
          onClick={handleClickConfirm}
        />
      </Layout.Fixed>
    </>
  );
}

export default ConfirmPassword;
