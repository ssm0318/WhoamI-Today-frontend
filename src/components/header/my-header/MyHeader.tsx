import { useState } from 'react';
import SideMenu from '@components/header/side-menu/SideMenu';
import { Font, Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function MyHeader() {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const myProfile = useBoundStore((state) => state.myProfile);

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <>
      <Layout.FlexRow>
        <Font.Display type="24_regular">{myProfile?.username}</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8}>
        <SvgIcon name="top_navigation_edit" size={44} />
        <button type="button" onClick={handleClickHamburger}>
          <SvgIcon name="top_navigation_hamburger" size={44} />
        </button>
      </Layout.FlexRow>
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default MyHeader;
