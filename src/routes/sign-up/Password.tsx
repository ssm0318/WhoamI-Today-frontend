import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';

function Password() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  return (
    <>
      <input placeholder={t('password') || ''} type="password" />
      <Button.Large type="filled" status="normal" sizing="stretch" text={t('next')} />
    </>
  );
}

export default Password;
