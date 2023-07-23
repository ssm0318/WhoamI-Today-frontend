import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '@components/_common/divider/Divider';
import MainContainer from '@components/_common/main-container/MainContainer';
import Tabs from '@components/_common/tabs/Tabs';
import FriendList from '@components/friends-settings/friend-list/FriendList';
import FriendRequestList from '@components/friends-settings/friend-request-list/FriendRequestList';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import i18n from '@i18n/index';

const TabList = [
  { key: 'friends', text: i18n.t('settings.friends.tab.friends') },
  { key: 'request', text: i18n.t('settings.friends.tab.request') },
];

function FriendsSettings() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends' });
  const [selectedTab, setSelectedTab] = useState('friends');
  return (
    <MainContainer>
      <TitleHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%">
        {/* TODO: 친구 검색 */}
        {/* TODO: 친구 초대 */}
        <Divider width={1} />
        {selectedTab === 'friends' ? <FriendList /> : <FriendRequestList />}
      </Layout.FlexCol>
      <Layout.Fixed b={0} l="50%" tl={['-50%', '-50%']}>
        <Tabs
          tabList={TabList}
          selectedKey={selectedTab}
          onClick={setSelectedTab}
          displayFontType="14_semibold"
          bgColor="BACKGROUND_COLOR"
          tabWidth={90}
        />
      </Layout.Fixed>
    </MainContainer>
  );
}

export default FriendsSettings;
