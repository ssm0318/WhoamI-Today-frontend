import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { validateEmail } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function Email() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const { setSignUpInfo, signUpInfo } = useBoundStore((state) => ({
    setSignUpInfo: state.setSignUpInfo,
    signUpInfo: state.signUpInfo,
  }));
  const [emailInput, setEmailInput] = useState(signUpInfo.email || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    if (emailError) setEmailError(null);
  };

  const navigate = useNavigate();
  const onClickNext = () => {
    const username = emailInput.split('@')[0];
    validateEmail({
      email: emailInput,
      onSuccess: () => {
        setSignUpInfo({
          email: emailInput,
          username,
        });
        navigate('/signup/password');
      },
      onError: (e) => setEmailError(e),
    });
  };

  return (
    <>
      <ValidatedInput
        label={t('email')}
        name="email"
        type="email"
        inputMode="email"
        value={emailInput}
        onChange={handleChange}
        error={emailError}
        guide={t('email_guide')}
      />
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={!emailInput || emailError ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
    </>
  );
}

export default Email;
