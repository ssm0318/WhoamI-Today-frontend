import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';

function ProfileImage() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  return (
    <>
      <input type="file" accept="image/jpeg, image/png" />
      <Button.Large type="filled" status="normal" sizing="stretch" text={t('add')} />
      <Button.Large type="filled" status="normal" sizing="stretch" text={t('skip')} />
    </>
  );
}

export default ProfileImage;
