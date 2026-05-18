import React, {
  CSSProperties,
  ReactNode,
  RefObject,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import NotiPermissionBanner, {
  NOTI_PERMISSION_BANNER_HEIGHT,
} from '@components/_common/noti-permission-banner/NotiPermissionBanner';
import BrowseModePreviewBar from '@components/browse-mode/BrowseModePreviewBar';
import BrowseModeSessionPrompt from '@components/browse-mode/BrowseModeSessionPrompt';
import CheckInFreshnessPrompt from '@components/check-in/check-in-freshness-prompt/CheckInFreshnessPrompt';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBrowseModeActivePersistence } from '@hooks/useBrowseModeActivePersistence';
import { useBrowseModeRouteSync } from '@hooks/useBrowseModeRouteSync';
import { useBrowseModeSessionPrompt } from '@hooks/useBrowseModeSessionPrompt';
import { useBrowseModeTabDurations } from '@hooks/useBrowseModeTabDurations';
import { useCheckInFreshnessPrompt } from '@hooks/useCheckInFreshnessPrompt';
import useFcm from '@hooks/useFcm';
import { useLastVisitedTabPersistence } from '@hooks/useLastVisitedTabPersistence';
import { VersionType } from '@models/api/user';
import { SetAppStateData } from '@models/app';
import { useBoundStore } from '@stores/useBoundStore';
import { MainWrapper, RootContainer } from '@styles/wrappers';
import { getMyProfile } from '@utils/apis/my';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import {
  recordCurrentVersion,
  shouldShowWidgetGuideOnVersionChange,
} from '@utils/widgetInstallGuide';
import { useChatListSocket } from './chat/_hooks/useChatListSocket';
import InvitePending from './InvitePending';

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
  const browseModePrompt = useBrowseModeSessionPrompt();
  // Honour per-tab fade-out timers on the active mode (Digital detox-style).
  // Mounted here so it spans the entire app session, not just while the
  // picker is open.
  useBrowseModeTabDurations();
  // Persist activeBrowseMode in sessionStorage so a page refresh keeps the
  // user's pick within the same tab. Cleared on tab close (next visit
  // starts fresh and the auto-prompt logic decides whether to ask again).
  useBrowseModeActivePersistence();
  // Bounce off tabs the active browse mode no longer surfaces.
  useBrowseModeRouteSync();
  // Mirror the user's current tab to localStorage for cold-start restore.
  useLastVisitedTabPersistence();
  const isBrowseModePickerOpen = useBoundStore((state) => state.isBrowseModePickerOpen);
  const openBrowseModePicker = useBoundStore((state) => state.openBrowseModePicker);
  const closeBrowseModePicker = useBoundStore((state) => state.closeBrowseModePicker);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/discover') return;
    const params = new URLSearchParams(location.search);
    if (params.get('browse_mode') !== 'picker') return;
    if (myProfile?.current_ver !== VersionType.VER_W) return;

    openBrowseModePicker();
    params.delete('browse_mode');
    const search = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : '',
        hash: location.hash,
      },
      { replace: true },
    );
  }, [
    location.hash,
    location.pathname,
    location.search,
    myProfile?.current_ver,
    navigate,
    openBrowseModePicker,
  ]);

  useEffect(() => {
    console.debug('featureFlags', featureFlags);
  }, [featureFlags]);

  // Firebase Analytics: screen_view + screen_dwell tracking on route change
  const pageStartTimeRef = useRef<number>(Date.now());
  const currentPageNameRef = useRef<string | null>(null);

  const flushScreenDwell = useCallback(() => {
    if (currentPageNameRef.current === null) return;
    const duration_ms = Date.now() - pageStartTimeRef.current;
    if (duration_ms < 100) return;
    postMessage('ANALYTICS_TRACK_EVENT', {
      name: 'screen_dwell',
      params: {
        screen_name: currentPageNameRef.current,
        duration_ms,
      },
    });
  }, [postMessage]);

  useEffect(() => {
    const pageName = location.pathname.split('/').filter(Boolean)[0] || 'home';
    flushScreenDwell();
    pageStartTimeRef.current = Date.now();
    currentPageNameRef.current = pageName;
    postMessage('ANALYTICS_PAGE_VIEW', {
      page_name: pageName,
      page_path: location.pathname,
    });
  }, [location.pathname, postMessage, flushScreenDwell]);

  // Firebase Analytics: app_foreground / app_background via SET_APP_STATE bridge
  const lastAppLifecycleStateRef = useRef<'foreground' | 'background' | null>(null);
  const handleAppLifecycle = useCallback(
    (data: SetAppStateData) => {
      if (!data) return;
      const nextState: 'foreground' | 'background' =
        data.value === 'active' ? 'foreground' : 'background';
      if (lastAppLifecycleStateRef.current === nextState) return;

      if (nextState === 'background') {
        flushScreenDwell();
        pageStartTimeRef.current = Date.now();
        postMessage('ANALYTICS_TRACK_EVENT', { name: 'app_background' });
      } else {
        pageStartTimeRef.current = Date.now();
        postMessage('ANALYTICS_TRACK_EVENT', { name: 'app_foreground' });
      }
      lastAppLifecycleStateRef.current = nextState;
    },
    [postMessage, flushScreenDwell],
  );
  useGetAppMessage({ key: 'SET_APP_STATE', cb: handleAppLifecycle });

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

  const hasHandledVersionChangeRef = useRef(false);
  useEffect(() => {
    if (!myProfile) return;
    if (hasHandledVersionChangeRef.current) return;
    hasHandledVersionChangeRef.current = true;

    if (shouldShowWidgetGuideOnVersionChange(myProfile)) {
      recordCurrentVersion(myProfile);
      navigate('/widget-install-guide');
      return;
    }
    recordCurrentVersion(myProfile);
  }, [myProfile, navigate]);

  // Refresh unread badge: WebSocket + poll + visibility change
  const refreshUnreadCount = useCallback(() => {
    getMyProfile().catch(() => {});
  }, []);

  const isViewingChatListUpdateRoom = useCallback(
    (data: { opponent_id?: number; room_id?: number; is_group?: boolean }) => {
      const oneOnOneMatch = location.pathname.match(/^\/users\/(\d+)\/chat\/?$/);
      if (oneOnOneMatch && data.opponent_id === Number(oneOnOneMatch[1])) return true;

      const groupMatch = location.pathname.match(/^\/chats\/group\/(\d+)\/?$/);
      if (groupMatch && data.is_group && data.room_id === Number(groupMatch[1])) return true;

      return false;
    },
    [location.pathname],
  );

  const onChatListSocketUpdate = useCallback(
    (data: {
      unread_count?: number;
      opponent_id?: number;
      room_id?: number;
      is_group?: boolean;
    }) => {
      if (typeof data.unread_count === 'number') {
        if (isViewingChatListUpdateRoom(data)) return;
        refreshUnreadCount();
      }
    },
    [isViewingChatListUpdateRoom, refreshUnreadCount],
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

  if (myProfile?.invite_status === 'pending') {
    return (
      <SWRConfig value={{ provider: () => new Map() }}>
        <Layout.FlexRow justifyContent="center" bgColor="BLACK" w="100%">
          <RootContainer w="100%" bgColor="WHITE" id="root-container">
            <InvitePending />
          </RootContainer>
        </Layout.FlexRow>
      </SWRConfig>
    );
  }

  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Layout.FlexRow justifyContent="center" bgColor="BLACK" w="100%">
        <RootContainer w="100%" bgColor="WHITE" id="root-container">
          {/* Sticky bar: only renders during a transient "Apply without saving"
              preview. Sits above the header so it's clear the current view is
              hypothetical and one tap exits back to the picker. */}
          <BrowseModePreviewBar />
          <Header />
          <Outlet />
          <CheckInFreshnessPrompt visible={shouldShow} onDismiss={dismiss} checkIn={checkIn} />
          {/* Single picker instance — auto-prompt OR manual open, never both.
              Mounting two instances caused the customize/wishlist sheets to
              double up: clicking a link in one instance could open the OTHER
              instance's sheet, which then refused to close from this one's
              orchestrator. Consolidating fixes that.
              Auto-prompt wins when both could fire (it's the one that knows
              the user is in a fresh session and hasn't picked yet). */}
          <BrowseModeSessionPrompt
            visible={browseModePrompt.shouldShow || isBrowseModePickerOpen}
            fullScreen={browseModePrompt.shouldShow}
            onDismiss={
              browseModePrompt.shouldShow ? browseModePrompt.dismiss : closeBrowseModePicker
            }
            onFinish={browseModePrompt.shouldShow ? browseModePrompt.finish : closeBrowseModePicker}
          />
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
