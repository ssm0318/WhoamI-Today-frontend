import { ReactNode, RefObject, UIEvent, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SWRConfig } from 'swr';
import NotiPermissionBanner, {
  NOTI_PERMISSION_BANNER_HEIGHT,
} from '@components/_common/noti-permission-banner/NotiPermissionBanner';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useFcm from '@hooks/useFcm';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
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
    if (!document.cookie) return;
    postMessage('SET_COOKIE', {
      value: document.cookie,
    });
  }, [postMessage]);

  const { featureFlags } = useBoundStore(UserSelector);

  useEffect(() => {
    console.debug(`featureFlags`, featureFlags);
  }, [featureFlags]);

  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Layout.FlexRow justifyContent="center" bgColor="WHITE" w="100%">
        <RootContainer w="100%" bgColor="WHITE" id="root-container">
          <Header />
          <Outlet />
          <Tab />
        </RootContainer>
      </Layout.FlexRow>
    </SWRConfig>
  );
}

export default Root;

interface MainScrollContainerProps {
  children?: ReactNode;
  scrollRef?: RefObject<HTMLDivElement>;
  onScroll?: (e: UIEvent) => void;
}

export function MainScrollContainer({ children, scrollRef, onScroll }: MainScrollContainerProps) {
  const { isMobile } = getMobileDeviceInfo();
  const showNotificationPermission = !isMobile;

  return (
    <MainWrapper
      id={MAIN_SCROLL_CONTAINER_ID}
      ref={scrollRef}
      alignItems="center"
      pt={TOP_NAVIGATION_HEIGHT}
      pb={BOTTOM_TABBAR_HEIGHT + (showNotificationPermission ? NOTI_PERMISSION_BANNER_HEIGHT : 0)}
      onScroll={onScroll}
    >
      {children}
      <Outlet />
      {/* 데스크톱 웹만 노출 */}
      {showNotificationPermission && <NotiPermissionBanner />}
    </MainWrapper>
  );
}
