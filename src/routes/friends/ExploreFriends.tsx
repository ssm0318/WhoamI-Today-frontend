import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider } from '@components/_common/divider/Divider.styled';
import Tabs from '@components/_common/tabs/Tabs';
import FriendInvitation from '@components/friends/explore-friends/friend-invitation/FriendInvitation';
import FriendSearchInput from '@components/friends/explore-friends/friend-search/FriendSearchInput';
import FriendList from '@components/friends-settings/friend-list/FriendList';
import FriendRequestList from '@components/friends-settings/friend-request-list/FriendRequestList';
import FriendSearchList from '@components/friends-settings/friend-search-list/FriendSearchList';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import i18n from '@i18n/index';

const TabList = [
  { key: 'friends', text: i18n.t('settings.friends.tab.friends') },
  { key: 'request', text: i18n.t('settings.friends.tab.request') },
];

function ExploreFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends' });

  const [selectedTab, setSelectedTab] = useState('friends');
  const [query, setQuery] = useState('');

  return (
    <>
      <SubHeader title={t('explore_friends')} />
      <Layout.FlexCol w="100%">
        <Layout.FlexCol w="100%" gap={16} p={16}>
          <FriendSearchInput query={query} setQuery={setQuery} />
          <FriendInvitation />
        </Layout.FlexCol>
        <Divider width={1} />
        {query ? (
          <FriendSearchList query={query} />
        ) : (
          <>
            {selectedTab === 'friends' ? <FriendList /> : <FriendRequestList />}
            <Layout.Fixed b={BOTTOM_TABBAR_HEIGHT} l="50%" tl={['-50%', '-50%']}>
              <Tabs
                tabList={TabList}
                selectedKey={selectedTab}
                onClick={setSelectedTab}
                tabWidth={111}
              />
            </Layout.Fixed>
          </>
        )}
      </Layout.FlexCol>
    </>
  );
}

export default ExploreFriends;
