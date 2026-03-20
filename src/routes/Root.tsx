import React, { CSSProperties, ReactNode, RefObject, UIEvent, useEffect } from 'react';
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
    console.debug('featureFlags', featureFlags);
  }, [featureFlags]);

  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Layout.FlexRow justifyContent="center" bgColor="BLACK" w="100%">
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
  showNotificationPermission?: boolean;
  style?: CSSProperties;
  pb?: number;
}

export function MainScrollContainer({
  children,
  scrollRef,
  onScroll,
  showNotificationPermission = false,
  style,
  pb,
}: MainScrollContainerProps) {
  const { isMobile } = getMobileDeviceInfo();
  const showBanner = showNotificationPermission && !isMobile;

  const bottomPadding =
    pb !== undefined ? pb : BOTTOM_TABBAR_HEIGHT + (showBanner ? NOTI_PERMISSION_BANNER_HEIGHT : 0);

  // iOS: input 포커스 시 스크롤이 막히는 현상. input/textarea·추천 드롭다운 밖을 터치하면 blur하여 스크롤이 먹히도록 함.
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as Node;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
    // 추천 드롭다운 항목 탭(선택) 시에는 blur하지 않음 — 터치하면 입력되도록
    if (target instanceof Element && target.closest?.('[data-hashtag-dropdown]')) return;
    const el = document.activeElement;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      (el as HTMLInputElement).blur();
    }
  };

  return (
    <MainWrapper
      id={MAIN_SCROLL_CONTAINER_ID}
      ref={scrollRef}
      alignItems="center"
      pt={TOP_NAVIGATION_HEIGHT}
      pb={bottomPadding}
      onScroll={onScroll}
      onTouchStart={handleTouchStart}
      style={style}
    >
      {children}
      <Outlet />
      {/* 데스크톱 웹만 노출 */}
      {showBanner && <NotiPermissionBanner />}
    </MainWrapper>
  );
}
