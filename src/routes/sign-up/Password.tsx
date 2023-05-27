import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { validatePassword } from '@utils/apis/user';

function Password() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signUpInfo, setSignUpInfo] = useBoundStore((state) => [
    state.signUpInfo,
    state.setSignUpInfo,
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    if (passwordError) setPasswordError(null);
  };

  const navigate = useNavigate();
  const onClickNext = () => {
    const { email, username } = signUpInfo;

    if (!email || !username) {
      // TODO
      return;
    }

    validatePassword({
      email,
      username,
      password: passwordInput,
      onSuccess: () => {
        setSignUpInfo({ password: passwordInput });
        navigate('/signup/profile-image');
      },
      onError: (e) => setPasswordError(e),
    });
  };

  return (
    <>
      <ValidatedInput
        name="password"
        placeholder={t('password') || ''}
        type="password"
        value={passwordInput}
        onChange={handleChange}
        error={passwordError}
        guide={t('password_constraints')}
      />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status={!passwordInput || passwordError ? 'disabled' : 'normal'}
          sizing="stretch"
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Absolute>
    </>
  );
}

export default Password;
