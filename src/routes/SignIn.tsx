import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import { Button, CommonInput, Font, Layout } from '@design-system';
import { SignInParams } from '@models/api/user';
import { signIn } from '@utils/apis/user';

function SignIn() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_in' });

  const [signInInfo, setSignInInfo] = useState<SignInParams>({ username: '', password: '' });
  const [signInError, setSignInError] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (signInError) {
      setSignInError('');
    }

    const { name, value } = e.target;
    setSignInInfo((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const onSubmit = () => {
    signIn({ signInInfo, onSuccess: () => navigate('/home'), onError: (e) => setSignInError(e) });
  };

  const onKeySubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <MainContainer>
      <CommonInput
        name="username"
        placeholder={t('username_or_email') || undefined}
        value={signInInfo.username}
        onChange={handleChange}
        onKeyDown={onKeySubmit}
      />
      <CommonInput
        name="password"
        type="password"
        placeholder={t('password') || undefined}
        value={signInInfo.password}
        onChange={handleChange}
        onKeyDown={onKeySubmit}
      />
      <Layout.Absolute w="100%" b="50px" flexDirection="column" gap={24}>
        {signInError && (
          <Font.Body type="12_regular" color="ERROR">
            {signInError}
          </Font.Body>
        )}
        <Button.Large
          type="filled"
          onClick={onSubmit}
          text={t('sign_in')}
          status={signInInfo.username === '' || signInInfo.password === '' ? 'disabled' : 'normal'}
          sizing="stretch"
        />
        <Button.Large
          type="white_fill"
          status="normal"
          to="/forgot-password"
          text={t('forgot_password')}
          sizing="stretch"
        />
        <Button.Large
          type="white_fill"
          status="normal"
          to="/signup/email"
          text={t('sign_up')}
          sizing="stretch"
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default SignIn;
