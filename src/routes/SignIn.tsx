import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@design-system';
import { SignInParams } from '@models/api/user';
import { CommonWrapper } from '@styles/wrappers.styled';
import signIn from '@utils/apis/user';
import CommonInput from 'src/design-system/Inputs/Input.styled';

function SignIn() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_in' });

  const [signInInfo, setSignInInfo] = useState<SignInParams>({ username: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInInfo((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const onSubmit = () => {
    signIn(signInInfo, () => navigate('/today'));
  };

  const onKeySubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <CommonWrapper>
      <CommonInput
        name="username"
        placeholder={t('username_or_email') || undefined}
        value={signInInfo.username}
        onChange={handleChange}
        onKeyDown={onKeySubmit}
      />
      <CommonInput
        name="password"
        placeholder={t('password') || undefined}
        value={signInInfo.password}
        onChange={handleChange}
        onKeyDown={onKeySubmit}
      />

      <Button.Large
        type="filled"
        onClick={onSubmit}
        text={t('sign_in')}
        status={signInInfo.username === '' || signInInfo.password === '' ? 'disabled' : 'normal'}
      />
      <Button.Large
        type="white_fill"
        status="normal"
        to="/forgot-password"
        text={t('forgot_password')}
      />
      <Button.Large type="white_fill" status="normal" to="/signup" text={t('sign_up')} />
    </CommonWrapper>
  );
}

export default SignIn;
