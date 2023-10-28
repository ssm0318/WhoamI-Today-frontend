import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import SideMenu from '@components/header/side-menu/SideMenu';
import { Font, Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { HeaderWrapper, Noti, RightIconArea } from './Header.styled';

function Header() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const myProfile = useBoundStore((state) => state.myProfile);
  const isChatsTab = useMatch('/chats/*');

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  if (isChatsTab) return <ChatsHeader />;
  return (
    <>
      <HeaderWrapper>
        <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
          <SvgIcon name="header_logo" size={71} />
          <Layout.FlexRow gap={8}>
            <button type="button" onClick={handleClickHamburger}>
              <SvgIcon name="top_navigation_hamburger" size={36} />
            </button>
            <Noti to="/notifications">
              <SvgIcon name="top_navigation_noti" size={36} />
              {myProfile?.unread_noti && <IconNudge />}
            </Noti>
          </Layout.FlexRow>
        </Layout.FlexRow>
      </HeaderWrapper>
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default Header;

function ChatsHeader() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats' });
  const navigate = useNavigate();

  const handleClickGoBack = () => {
    navigate(-1);
  };

  const handleClickCreateChatRoom = () => {
    // TODO: 채팅방 생성
  };

  const handleClickMenu = () => {
    // TODO: 채팅탭 메뉴
  };

  return (
    <HeaderWrapper>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <button type="button" onClick={handleClickGoBack}>
          <SvgIcon name="arrow_left_bold" size={20} color="BASIC_BLACK" />
        </button>
        <Font.Body type="20_semibold">{t('title')}</Font.Body>
        <RightIconArea>
          <button type="button" onClick={handleClickMenu}>
            <SvgIcon name="menu_dots" size={20} />
          </button>
          <Layout.Absolute l={-34} onClick={handleClickCreateChatRoom}>
            <button type="button">
              <SvgIcon name="create_chats" size={20} />
            </button>
          </Layout.Absolute>
        </RightIconArea>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}
