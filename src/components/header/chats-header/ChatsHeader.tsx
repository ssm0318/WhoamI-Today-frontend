import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import { Layout } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import BrowseModeHeaderButton from '../browse-mode-header-button/BrowseModeHeaderButton';
import { HeaderWrapper, Noti } from '../Header.styled';
import SideMenu from '../side-menu/SideMenu';

function ChatsHeader() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const navigate = useNavigate();
  const { myProfile } = useBoundStore((state) => ({
    myProfile: state.myProfile,
  }));

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <HeaderWrapper>
        <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
          <Layout.FlexRow gap={5} alignItems="center">
            <Icon name="group_chat_new" size={44} onClick={() => navigate('/chats/new-group')} />
            <Icon name="search_black" size={44} onClick={() => navigate('/chats/search')} />
          </Layout.FlexRow>
          <Layout.FlexRow gap={5} alignItems="center">
            <BrowseModeHeaderButton />
            <Noti to="/notifications">
              <Icon
                name="notification"
                size={44}
                onClick={() => resetScrollPosition('notificationsPage')}
              />
              <Layout.Absolute t={4} r={4}>
                {!!myProfile?.unread_noti_cnt && (
                  <IconNudge size={18} count={myProfile?.unread_noti_cnt} />
                )}
              </Layout.Absolute>
            </Noti>
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </HeaderWrapper>
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default ChatsHeader;
