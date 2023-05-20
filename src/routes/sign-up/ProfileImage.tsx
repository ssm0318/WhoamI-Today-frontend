import { useTranslation } from 'react-i18next';
import { Button, Layout } from '@design-system';

function ProfileImage() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  return (
    <>
      <input type="file" accept="image/jpeg, image/png" />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large type="filled" status="normal" sizing="stretch" text={t('add')} />
        <Button.Large type="filled" status="normal" sizing="stretch" text={t('skip')} />
      </Layout.Absolute>
    </>
  );
}

export default ProfileImage;
