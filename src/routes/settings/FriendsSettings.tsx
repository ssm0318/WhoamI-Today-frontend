import { useTranslation } from 'react-i18next';
import Divider from '@components/_common/divider/Divider';
import MainContainer from '@components/_common/main-container/MainContainer';
import FriendList from '@components/friends-settings/friend-list/FriendList';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

function FriendsSettings() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends' });
  return (
    <MainContainer>
      <TitleHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%">
        {/* TODO: 친구 검색 */}
        {/* TODO: 친구 초대 */}
        <Divider width={1} />
        <FriendList />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default FriendsSettings;
