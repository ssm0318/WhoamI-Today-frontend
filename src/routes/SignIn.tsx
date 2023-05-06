import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '@components/_common/buttons/Button';
import LinkButton from '@components/_common/buttons/LinkButton';
import CommonInput from '@components/_common/Inputs/Input.styled';
import { SignInParams } from '@models/api/user';
import { CommonWrapper } from '@styles/wrappers.styled';
import signIn from '@utils/apis/user';

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

      <Button type="primary" onClick={onSubmit}>
        {t('sign_in')}
      </Button>
      <LinkButton to="/forgot-password" type="secondary">
        {t('forgot_password')}
      </LinkButton>
      <LinkButton to="/signup" type="secondary">
        {t('sign_up')}
      </LinkButton>
    </CommonWrapper>
  );
}

export default SignIn;
