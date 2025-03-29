import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { useEffect } from 'react';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { firebaseConfig } from '../utils/firebaseHelpers';

let analytics: ReturnType<typeof getAnalytics> | null = null;

const useAnalytics = () => {
  const { myProfile } = useBoundStore(UserSelector);
  const initializeAnalytics = () => {
    try {
      const app = initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
      console.log('[useAnalytics] Firebase Analytics initialized');
    } catch (e) {
      console.log('[useAnalytics] init failed', e);
    }
  };

  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (!analytics) return;
    try {
      logEvent(analytics, eventName, eventParams);
      console.log(`[useAnalytics] Logged event: ${eventName}`, eventParams);
    } catch (e) {
      console.log('[useAnalytics] logEvent failed', e);
    }
  };

  // 👉 세션 추적도 여기서 처리
  useEffect(() => {
    if (!analytics) {
      initializeAnalytics();
    }

    const userInfo = {
      userId: myProfile?.id,
      userName: myProfile?.username,
    };

    const handleFocus = () => {
      trackEvent('session_resume', userInfo);
      console.log('[useAnalytics] session_resume');
    };

    const handleBlur = () => {
      trackEvent('session_pause', userInfo);
      console.log('[useAnalytics] session_pause');
    };

    const handleUnload = () => {
      trackEvent('session_end', userInfo);
      console.log('[useAnalytics] session_end');
    };

    // 앱 시작
    trackEvent('session_start', userInfo);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleUnload); // 창 닫을 때

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [myProfile]);

  return {
    trackEvent,
  };
};

export default useAnalytics;
