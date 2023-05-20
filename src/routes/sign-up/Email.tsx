import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';

function Email() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  return (
    <>
      <input placeholder={t('email') || ''} type="email" />
      <Button.Large type="filled" status="normal" sizing="stretch" text={t('next')} />
    </>
  );
}

export default Email;
