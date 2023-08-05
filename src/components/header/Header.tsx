import { useState } from 'react';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import SideMenu from '@components/header/side-menu/SideMenu';
import { Font, Layout, SvgIcon } from '@design-system';
import { HeaderWrapper, Noti } from './Header.styled';

function Header() {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center" ph="default">
        <button type="button" onClick={handleClickHamburger}>
          <SvgIcon name="top_navigation_hamburger" size={36} />
        </button>
        <Font.Display type="24_bold">Who Am I</Font.Display>
        <Noti to="/notifications">
          <SvgIcon name="top_navigation_noti" size={36} />
          {/* TODO(Gina): 추후 unread noti 있는지 여부로 노출 필요 */}
          <IconNudge />
        </Noti>
      </Layout.FlexRow>
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </HeaderWrapper>
  );
}

export default Header;
