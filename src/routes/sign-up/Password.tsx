import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { validatePassword } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function Password() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const setSignUpInfo = useBoundStore((state) => state.setSignUpInfo);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    if (passwordError) setPasswordError(null);
  };

  const navigate = useNavigate();
  const onClickNext = () => {
    validatePassword({
      password: passwordInput,
      onSuccess: () => {
        setSignUpInfo({ password: passwordInput });
        navigate('/signup/research-intro');
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
