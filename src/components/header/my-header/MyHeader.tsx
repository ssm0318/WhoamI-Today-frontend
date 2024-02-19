import { useState } from 'react';
import { useBoundStore } from '@stores/useBoundStore';
import Icon from '../../_common/icon/Icon';
import NewPostBottomSheet from '../bottom-sheet/NewPostBottomSheet';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

function MyHeader() {
  const myProfile = useBoundStore((state) => state.myProfile);

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [bottomSheet, setBottomSheet] = useState(false);

  // const navigate = useNavigate();

  const handleNewPost = () => {
    setBottomSheet(true);
  };

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  return (
    <>
      <MainHeader
        title={myProfile?.username ?? ''}
        rightButtons={
          <>
            <Icon name="new_chat" size={44} onClick={handleNewPost} />
            <Icon name="hamburger" size={44} onClick={handleClickHamburger} />
          </>
        }
      />
      {bottomSheet && (
        <NewPostBottomSheet visible={bottomSheet} closeBottomSheet={() => setBottomSheet(false)} />
      )}
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default MyHeader;
