import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import FriendList from '@components/friends-settings/friend-list/FriendList';
import TitleHeader from '@components/title-header/TitleHeader';

function FriendsSettings() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends' });
  return (
    <MainContainer>
      <TitleHeader title={t('title')} />
      {/* TODO: 친구 검색 */}
      {/* TODO: 친구 초대 */}
      <FriendList />
    </MainContainer>
  );
}

export default FriendsSettings;
