import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';

function UserName() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  return (
    <>
      <input placeholder={t('username') || ''} type="name" />
      <Button.Large type="filled" status="normal" sizing="stretch" text={t('next')} />
    </>
  );
}

export default UserName;
