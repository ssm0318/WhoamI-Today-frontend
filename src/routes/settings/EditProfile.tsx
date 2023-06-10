import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';

function EditProfile() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });
  return (
    <MainContainer>
      <TitleHeader title={t('edit_profile')} type="SUB" />
    </MainContainer>
  );
}

export default EditProfile;
