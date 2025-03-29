import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserProperties,
} from 'firebase/analytics';
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

  useEffect(() => {
    if (!analytics) {
      initializeAnalytics();
    }

    if (analytics) {
      if (process.env.NODE_ENV !== 'production') {
        setAnalyticsCollectionEnabled(analytics, true);
      }
      setUserProperties(analytics, {
        userId: myProfile?.id,
        username: myProfile?.username,
      });
    }

    const handleFocus = () => {
      trackEvent('session_resume');
      console.log('[useAnalytics] session_resume');
    };

    const handleBlur = () => {
      trackEvent('session_pause');
      console.log('[useAnalytics] session_pause');
    };

    const handleUnload = () => {
      trackEvent('session_end');
      console.log('[useAnalytics] session_end');
    };

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
