import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { sendResetPasswordEmail } from '@utils/apis/user';

function ForgotPassword() {
  const [t] = useTranslation('translation', { keyPrefix: 'forgot_password' });
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    if (emailError) setEmailError(null);
  };

  const handleClickSend = async () => {
    await sendResetPasswordEmail({
      email: emailInput,
      onSuccess: () => {
        openToast({ message: t('email_sent_success') });
        navigate('/signin');
      },
      onFail: () => {
        openToast({ message: t('email_sent_failed') });
      },
    });
  };

  return (
    <>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" ph={24} alignItems="center" gap={20}>
        <Typo type="body-large">{t('description')}</Typo>
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
        <Layout.Fixed l={0} b={20} w="100%" alignItems="center" ph="default">
          <Button.Confirm
            status={!emailInput || emailError ? 'disabled' : 'normal'}
            text={t('confirm')}
            onClick={handleClickSend}
            sizing="stretch"
          />
        </Layout.Fixed>
      </Layout.FlexCol>
    </>
  );
}

export default ForgotPassword;
