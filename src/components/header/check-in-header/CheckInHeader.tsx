import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import { Layout, Typo } from '@design-system';
import { resetScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { Noti } from '../Header.styled';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

function CheckInHeader() {
  const [searchParams] = useSearchParams();
  const initialShowSideMenu = searchParams.get('show_side_menu') === 'true' || false;
  const [showSideMenu, setShowSideMenu] = useState(initialShowSideMenu);

  const { myProfile, checkInSaveHandler, checkInSaving } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    checkInSaveHandler: state.checkInSaveHandler,
    checkInSaving: state.checkInSaving,
  }));

  useEffect(() => {
    getMe();
  }, []);

  const handleSave = () => {
    if (checkInSaveHandler && !checkInSaving) {
      checkInSaveHandler();
    }
  };

  return (
    <>
      <MainHeader
        title="Check-In"
        rightButtons={
          <>
            <button type="button" onClick={handleSave} disabled={checkInSaving}>
              <Typo
                type="title-large"
                color={checkInSaving ? 'MEDIUM_GRAY' : 'PRIMARY'}
                fontWeight={600}
              >
                {checkInSaving ? 'Saving...' : 'Save'}
              </Typo>
            </button>
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
            <Icon name="hamburger" size={44} onClick={() => setShowSideMenu(true)} />
          </>
        }
      />
      {showSideMenu && <SideMenu closeSideMenu={() => setShowSideMenu(false)} />}
    </>
  );
}

export default CheckInHeader;
