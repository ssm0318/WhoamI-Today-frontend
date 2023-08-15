import { useState } from 'react';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import SideMenu from '@components/header/side-menu/SideMenu';
import { Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { HeaderWrapper, Noti } from './Header.styled';

function Header() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const myProfile = useBoundStore((state) => state.myProfile);

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

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
