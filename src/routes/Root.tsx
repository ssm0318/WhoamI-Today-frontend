import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NotiPermissionBanner from '@components/_common/noti-permission-banner/NotiPermissionBanner';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useFcm from '@hooks/useFcm';
import { MainWrapper, RootContainer } from '@styles/wrappers';
import { getMobileDeviceInfo } from '@utils/getUserAgent';

function Root() {
  const { isMobile } = getMobileDeviceInfo();
  const { initializeFcm } = useFcm();
  const postMessage = usePostAppMessage();

  useAsyncEffect(async () => {
    if (isMobile) return;
    // 데스크톱인 경우에만 initializeFcm
    await initializeFcm();
  }, [isMobile]);

  useEffect(() => {
    postMessage('SET_COOKIE', {
      value: document.cookie,
    });
  }, [postMessage]);

  return (
    <Layout.FlexRow justifyContent="center" bgColor="BLACK" h="100vh" w="100%">
      <RootContainer w="100%" h="100vh" bgColor="WHITE">
        <Header />
        <MainWrapper alignItems="center" pt={TOP_NAVIGATION_HEIGHT} pb={BOTTOM_TABBAR_HEIGHT}>
          <Outlet />
        </MainWrapper>
        {/* 데스크톱 웹만 노출 */}
        {!isMobile && <NotiPermissionBanner />}
        <Tab />
      </RootContainer>
    </Layout.FlexRow>
  );
}

export default Root;
