import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { useBoundStore } from '@stores/useBoundStore';
import Icon from '../icon/Icon';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

function MyHeader() {
  const myProfile = useBoundStore((state) => state.myProfile);

  const [showSideMenu, setShowSideMenu] = useState(false);
=======
import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout } from '@design-system';

interface MyHeaderProps {
  onClickHamburger: () => void;
}

function MyHeader({ onClickHamburger }: MyHeaderProps) {
>>>>>>> 5497610 ((#220) 노트 마크업 (#223))
  const navigate = useNavigate();

  const handleEditStatus = () => {
    // 수정 페이지로 이동
    navigate('/check-in/edit');
  };

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <>
<<<<<<< HEAD
      <MainHeader
        title={myProfile?.username ?? ''}
        rightButtons={
          <>
            <Icon name="new_chat" size={44} onClick={handleEditStatus} />
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </>
        }
      />
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
=======
      <Layout.FlexRow>
        <Font.Display type="24_regular">My Profile</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8} alignItems="center">
        <IconButton name="add_post" size={44} onClick={handleEditStatus} />
        <IconButton name="top_navigation_hamburger" size={44} onClick={onClickHamburger} />
      </Layout.FlexRow>
>>>>>>> 5497610 ((#220) 노트 마크업 (#223))
    </>
  );
}

export default MyHeader;
