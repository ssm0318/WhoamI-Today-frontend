import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';

function ExploreFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });
  return <SubHeader title={t('explore_friends')} />;
}

export default ExploreFriends;
