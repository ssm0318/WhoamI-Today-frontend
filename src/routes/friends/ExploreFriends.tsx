import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@components/_common/divider/Divider.styled';
import SearchInput from '@components/_common/search-input/SearchInput';
import Tabs from '@components/_common/tabs/Tabs';
import FriendInvitation from '@components/friends/explore-friends/friend-invitation/FriendInvitation';
import FriendSearchList from '@components/friends/explore-friends/friend-search-list/FriendSearchList';
import RecommendedList from '@components/friends/explore-friends/recommended-list/RecommendedList';
import RequestList from '@components/friends/explore-friends/request-list/RequestList';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import i18n from '@i18n/index';
import { useBoundStore } from '@stores/useBoundStore';
import { MainScrollContainer } from 'src/routes/Root';
import { Typo } from '../../design-system/Font/index';

const TabList = [
  { key: 'requests', text: i18n.t('friends.explore_friends.tab.requests') },
  { key: 'recommended', text: i18n.t('friends.explore_friends.tab.recommended') },
];

function ExploreFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends' });
  const navigate = useNavigate();

  const { featureFlags } = useBoundStore((state) => ({
    featureFlags: state.featureFlags,
  }));

  const [selectedTab, setSelectedTab] = useState('requests');
  const [query, setQuery] = useState('');

  const handleClickDone = () => {
    navigate(featureFlags?.friendFeed ? '/friends/feed' : '/friends');
  };

  return (
    <MainScrollContainer>
      <SubHeader
        title={t('title')}
        RightComponent={
          <button type="button" onClick={handleClickDone}>
            <Typo type="title-large" color="PRIMARY">
              {t('done')}
            </Typo>
          </button>
        }
      />
      <Layout.FlexCol w="100%">
        <Layout.FlexCol w="100%" gap={16} p={16}>
          <SearchInput
            query={query}
            setQuery={setQuery}
            fontSize={16}
            placeholder={t('search.placeholder') || undefined}
            cancelText={t('search.cancel') || undefined}
          />
          {!query && <FriendInvitation />}
        </Layout.FlexCol>
        {query ? (
          <FriendSearchList query={query} />
        ) : (
          <>
            <Divider width={1} />
            {selectedTab === 'requests' ? <RequestList /> : <RecommendedList />}
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
    </MainScrollContainer>
  );
}

export default ExploreFriends;
