import { Outlet } from 'react-router-dom';
import NotiPermissionBanner from '@components/_common/noti-permission-banner/NotiPermissionBanner';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useFcm from '@hooks/useFcm';
import { MainWrapper, RootContainer } from '@styles/wrappers';
import { getMobileDeviceInfo } from '@utils/getUserAgent';

function Root() {
  const { initializeFcm, requestNotiPermission } = useFcm();
  const { isMobile } = getMobileDeviceInfo();

  useAsyncEffect(async () => {
    if (!isMobile) return;
    await initializeFcm();
  }, [isMobile]);

  return (
    <Layout.FlexRow justifyContent="center" bgColor="BASIC_BLACK" h="100vh" w="100%">
      <RootContainer w="100%" h="100vh" bgColor="BASIC_WHITE">
        <Header />
        <MainWrapper
          alignItems="center"
          pt={TOP_NAVIGATION_HEIGHT}
          pb={BOTTOM_TABBAR_HEIGHT}
          bgColor="BACKGROUND_COLOR"
        >
          <Outlet />
        </MainWrapper>
        {/* 앱이거나 모바일 웹인 경우는 보여주지 않음 */}
        {!isMobile && Notification.permission === 'default' && (
          <NotiPermissionBanner onClick={requestNotiPermission} />
        )}
        <Tab />
      </RootContainer>
    </Layout.FlexRow>
  );
}

export default Root;
