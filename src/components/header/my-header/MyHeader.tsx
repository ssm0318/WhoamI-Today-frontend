import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '@stores/useBoundStore';
import HeaderContainer from '../HeaderContainer';
import Icon from '../icon/Icon';
import SideMenu from '../side-menu/SideMenu';

function MyHeader() {
  const myProfile = useBoundStore((state) => state.myProfile);

  const [showSideMenu, setShowSideMenu] = useState(false);
  const navigate = useNavigate();

  const handleEditStatus = () => {
    // 수정 페이지로 이동
    navigate('/status/edit');
  };

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <>
      <HeaderContainer
        title={myProfile?.username ?? ''}
        rightButtons={
          <>
            <Icon name="new_chat" size={44} onClick={handleEditStatus} />
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </>
        }
      />
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default MyHeader;
