import { useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { Noti } from '../Header.styled';
import MainHeader from '../MainHeader';
import NewFloatingButton from '../new-floating-button/NewFloatingButton';
import SideMenu from '../side-menu/SideMenu';

interface CommonHeaderProps {
  title: string;
}

function CommonHeader({ title }: CommonHeaderProps) {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const currentUser = useBoundStore((state) => state.myProfile);

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <>
      <MainHeader
        title={title}
        rightButtons={
          <>
            <Noti to="/notifications">
              <Icon name="notification" size={44} />
              <Layout.Absolute t={4} r={4}>
                {currentUser?.unread_noti && <IconNudge />}
              </Layout.Absolute>
            </Noti>
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </>
        }
      />
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
      <NewFloatingButton />
    </>
  );
}

export default CommonHeader;
