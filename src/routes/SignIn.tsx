import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import { FEED_DEFAULT_REDIRECTION_PATH, FRIEND_DEFAULT_REDIRECTION_PATH } from '@constants/url';
import { Button, Font, Layout } from '@design-system';
import { SignInParams, VersionType } from '@models/api/user';
import { getMe } from '@utils/apis/my';
import { signIn } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

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
    signIn({
      signInInfo,
      onSuccess: () => {
        getMe().then((me) => {
          // 로그인하자마자 버전 확인하여 버전에 따라 리다이렉션
          const currVersion = me.current_ver;
          navigate(
            currVersion === VersionType.EXPERIMENT
              ? FRIEND_DEFAULT_REDIRECTION_PATH
              : FEED_DEFAULT_REDIRECTION_PATH,
          );

          if (!me.has_changed_pw) {
            navigate('/settings/reset-password?first_login=true');
          }
        });
      },
      onError: (e) => setSignInError(e),
    });
  };

  const onKeySubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <>
      <Layout.FlexCol w="100%" alignItems="center" mt={100}>
        <img width="75px" src="/whoami-logo.svg" alt="who_am_i" />
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" mv={80} ph={24}>
        <ValidatedInput
          label={t('username_or_email')}
          name="username"
          type="text"
          value={signInInfo.username}
          onChange={handleChange}
        />
        <ValidatedPasswordInput
          label={t('password')}
          name="password"
          value={signInInfo.password}
          onChange={handleChange}
          onKeyDown={onKeySubmit}
        />
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" alignItems="center" gap={10}>
        {signInError && (
          <Font.Body type="18_regular" color="ERROR">
            {signInError}
          </Font.Body>
        )}
        <Button.Large
          type="gray_fill"
          onClick={onSubmit}
          text={t('sign_in')}
          status={signInInfo.username === '' || signInInfo.password === '' ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
        />
        <Layout.FlexRow w="100%" justifyContent="center" gap={20}>
          <a href="/forgot-password">
            <Font.Body type="18_regular">{t('forgot_password')}</Font.Body>
          </a>
          <a href="/signup/email">
            <Font.Body type="18_regular">{t('sign_up')}</Font.Body>
          </a>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </>
  );
}

export default SignIn;
