import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';

function EditFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });
  return <SubHeader title={t('edit_friends')} />;
}

export default EditFriends;
