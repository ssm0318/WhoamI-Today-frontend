import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import { Layout } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { Noti } from '../Header.styled';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

function FriendsHeader() {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const navigate = useNavigate();
  const { myProfile } = useBoundStore((state) => ({
    myProfile: state.myProfile,
  }));

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  const handleClickAddUser = () => {
    navigate('/friends/explore?tab=recommended');
  };

  // unread_noti_cnt 갱신을 위해 탭 변경시 getMe 실행
  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <MainHeader
        title="Friends"
        rightButtons={
          <>
            <Icon name="add_user" size={44} onClick={handleClickAddUser} />
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
          </>
        }
      />
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default FriendsHeader;
