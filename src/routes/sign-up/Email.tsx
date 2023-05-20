import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Layout } from '@design-system';
import { validateEmail } from '@utils/apis/user';

function Email() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    if (emailError) setEmailError(null);
  };

  const navigate = useNavigate();
  const onClickNext = () => {
    validateEmail({
      email: emailInput,
      onSuccess: () => navigate('/signup/password'),
      onError: (e) => setEmailError(e),
    });
  };

  return (
    <>
      <ValidatedInput
        name="email"
        placeholder={t('email') || ''}
        type="email"
        value={emailInput}
        onChange={handleChange}
        error={emailError}
      />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status={!emailInput || emailError ? 'disabled' : 'normal'}
          sizing="stretch"
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Absolute>
    </>
  );
}

export default Email;
