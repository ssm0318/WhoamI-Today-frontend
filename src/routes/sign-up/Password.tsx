import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import { AFTER_SIGNUP_PATH } from '@constants/url';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { signUp, validatePassword } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function Password() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const { signUpInfo, resetSignUpInfo, openToast } = useBoundStore((state) => ({
    signUpInfo: state.signUpInfo,
    resetSignUpInfo: state.resetSignUpInfo,
    openToast: state.openToast,
  }));
  const [passwordInput, setPasswordInput] = useState(signUpInfo.password || '');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    if (passwordError) setPasswordError(null);
  };

  const handleOnSignUpError = () => {
    openToast({ message: t('error') });
    navigate('/');
  };

  const navigate = useNavigate();
  const onClickNext = () => {
    validatePassword({
      password: passwordInput,
      onSuccess: () => {
        signUp({
          signUpInfo: {
            ...signUpInfo,
            password: passwordInput,
          },
          onSuccess: () => {
            resetSignUpInfo();
            // 가입 후 프로필 수정 페이지로 이동
            navigate(AFTER_SIGNUP_PATH);
          },
          onError: handleOnSignUpError,
        });
      },
      onError: (e) => setPasswordError(e),
    });
  };

  return (
    <>
      <ValidatedPasswordInput
        label={t('password')}
        name="password"
        value={passwordInput}
        onChange={handleChange}
        error={passwordError}
        guide={t('password_constraints')}
      />
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={!passwordInput || passwordError ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
    </>
  );
}

export default Password;
