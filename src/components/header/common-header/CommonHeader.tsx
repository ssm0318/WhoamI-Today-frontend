import { useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import { Noti } from '../Header.styled';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

interface CommonHeaderProps {
  title: string;
}

function CommonHeader({ title }: CommonHeaderProps) {
  const [showSideMenu, setShowSideMenu] = useState(false);

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
              {/* TODO 넛지 변경 */}
              {/* {myProfile?.unread_noti && <IconNudge />} */}
            </Noti>
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </>
        }
      />
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default CommonHeader;
