import React, { CSSProperties, ReactNode, RefObject, UIEvent, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SWRConfig } from 'swr';
import NotiPermissionBanner, {
  NOTI_PERMISSION_BANNER_HEIGHT,
} from '@components/_common/noti-permission-banner/NotiPermissionBanner';
import CheckInFreshnessPrompt from '@components/check-in/check-in-freshness-prompt/CheckInFreshnessPrompt';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useCheckInFreshnessPrompt } from '@hooks/useCheckInFreshnessPrompt';
import useFcm from '@hooks/useFcm';
import { useBoundStore } from '@stores/useBoundStore';
import { MainWrapper, RootContainer } from '@styles/wrappers';
import { getMyProfile } from '@utils/apis/my';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { useChatListSocket } from './chat/_hooks/useChatListSocket';

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

  const { featureFlags, myProfile } = useBoundStore((state) => ({
    featureFlags: state.featureFlags,
    myProfile: state.myProfile,
  }));
  const { shouldShow, dismiss, checkIn } = useCheckInFreshnessPrompt();
  const location = useLocation();

  useEffect(() => {
    console.debug('featureFlags', featureFlags);
  }, [featureFlags]);

  // Firebase Analytics: screen_view on route change
  useEffect(() => {
    const pageName = location.pathname.split('/').filter(Boolean)[0] || 'home';
    postMessage('ANALYTICS_PAGE_VIEW', {
      page_name: pageName,
      page_path: location.pathname,
    });
  }, [location.pathname, postMessage]);

  // Firebase Analytics: set user properties on profile load
  useEffect(() => {
    if (!myProfile) return;
    const profile = myProfile as Record<string, any>;
    const birthYear = profile.date_of_birth ? new Date(profile.date_of_birth).getFullYear() : null;
    const currentYear = new Date().getFullYear();
    let ageRange = 'unknown';
    if (birthYear) {
      const age = currentYear - birthYear;
      if (age < 18) ageRange = 'under_18';
      else if (age <= 24) ageRange = '18-24';
      else if (age <= 34) ageRange = '25-34';
      else ageRange = '35+';
    }
    const friendCount = profile.friend_count ?? profile.friends_count ?? 0;
    let friendTier = '0';
    if (friendCount >= 16) friendTier = '16+';
    else if (friendCount >= 6) friendTier = '6-15';
    else if (friendCount >= 1) friendTier = '1-5';

    postMessage('ANALYTICS_SET_USER', {
      user_id: profile.id,
      user_type: profile.user_type || 'unknown',
      user_group: profile.user_group || 'unknown',
      current_ver: profile.current_ver || 'unknown',
      ver_changed: profile.ver_changed_at ? 'true' : 'false',
      gender: String(profile.gender ?? 'not_specified'),
      age_range: ageRange,
      signup_date: profile.date_joined?.split('T')[0] || 'unknown',
      friend_count_tier: friendTier,
      notification_enabled: profile.noti_time ? 'true' : 'false',
    });
  }, [myProfile, postMessage]);

  // Refresh unread badge: WebSocket + poll + visibility change
  const refreshUnreadCount = useCallback(() => {
    getMyProfile().catch(() => {});
  }, []);
  const onChatListSocketUpdate = useCallback(
    (data: { unread_count?: number }) => {
      if (typeof data.unread_count === 'number') {
        refreshUnreadCount();
      }
    },
    [refreshUnreadCount],
  );
  useChatListSocket(onChatListSocketUpdate);

  useEffect(() => {
    // Poll every 60s for unread count (WebSocket handles real-time)
    const interval = setInterval(refreshUnreadCount, 60000);

    // Also refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUnreadCount();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshUnreadCount]);

  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Layout.FlexRow justifyContent="center" bgColor="BLACK" w="100%">
        <RootContainer w="100%" bgColor="WHITE" id="root-container">
          <Header />
          <Outlet />
          <CheckInFreshnessPrompt visible={shouldShow} onDismiss={dismiss} checkIn={checkIn} />
        </RootContainer>
        <Tab />
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

  const bottomPadding = pb !== undefined ? pb : showBanner ? NOTI_PERMISSION_BANNER_HEIGHT : 0;

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
