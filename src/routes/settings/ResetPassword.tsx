import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout } from '@design-system';
import { resetPassword } from '@utils/apis/user';

function ResetPassword() {
  const [t] = useTranslation('translation');
  // 비밀번호 변경 이메일에서 redirect된 경우 받은 id, token
  const { id, token } = useParams();
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const navigate = useNavigate();
  const handleClickConfirm = () => {
    resetPassword({
      id,
      token,
      password: passwordInput,
      onSuccess: () => navigate('/settings'),
      onError: (e) => setPasswordError(e),
    });
  };

  return (
    <>
      <SubHeader typo="title-large" title={t('settings.reset_password')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" gap={10} ph={24}>
        <ValidatedPasswordInput
          label={t('settings.enter_your_new_password')}
          name="password"
          value={passwordInput}
          onChange={handleChange}
          error={passwordError}
          guide={t('sign_up.password_constraints')}
        />
      </Layout.FlexCol>
      <Layout.Fixed
        l={0}
        b={20 + (id && token ? 0 : BOTTOM_TABBAR_HEIGHT)}
        w="100%"
        alignItems="center"
        ph="default"
      >
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

export default ResetPassword;
