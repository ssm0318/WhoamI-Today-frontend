import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import IconNudge from '@components/_common/icon-nudge/IconNudge';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { Noti } from '../Header.styled';
import MainHeader from '../MainHeader';
import SideMenu from '../side-menu/SideMenu';

interface CommonHeaderProps {
  title: string;
}

function CommonHeader({ title }: CommonHeaderProps) {
  const [searchParams] = useSearchParams();
  // show_side_menu 파라미터가 true인 경우 사이드 메뉴 표시
  const initialShowSideMenu = searchParams.get('show_side_menu') === 'true' || false;
  const [showSideMenu, setShowSideMenu] = useState(initialShowSideMenu);
  const { myProfile } = useBoundStore((state) => ({
    myProfile: state.myProfile,
  }));

  const handleClickHamburger = () => {
    setShowSideMenu(true);
  };

  // unread_noti_cnt 갱신을 위해 탭 변경시 getMe 실행
  useEffect(() => {
    getMe();
  }, [title]);

  return (
    <>
      <MainHeader
        title={title}
        rightButtons={
          <>
            <Noti to="/notifications">
              <Icon name="notification" size={44} />
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

export default CommonHeader;
