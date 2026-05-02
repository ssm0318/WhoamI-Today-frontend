import { useCallback, useEffect, useRef, useState } from 'react';
import { FeatureFlagKey } from '@constants/featureFlag';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { SetAppStateData } from '@models/app';
import { MyCheckIn } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';

const AWAY_THRESHOLD_MS = 30 * 60 * 1000; // 30분
const CONTINUOUS_USE_THRESHOLD_MS = 10 * 60 * 1000; // 10분
const COOLDOWN_MS = 60 * 60 * 1000; // 1시간
const RECENT_UPDATE_GRACE_MS = 5 * 60 * 1000; // 5분
const AUTO_ARCHIVE_MS = 12 * 60 * 60 * 1000; // 12시간

function getStorageKey(userId: number, suffix: string) {
  return `wait_freshness_${suffix}_${userId}`;
}

function hasActiveCheckIn(checkIn: MyCheckIn | null): boolean {
  if (!checkIn) return false;
  return checkIn.social_battery !== null || (checkIn.mood && checkIn.mood.length > 0);
}

function isRecentlyUpdated(checkIn: MyCheckIn): boolean {
  const now = Date.now();
  const batteryTime = checkIn.battery_updated_at
    ? new Date(checkIn.battery_updated_at).getTime()
    : 0;
  const moodTime = checkIn.mood_updated_at ? new Date(checkIn.mood_updated_at).getTime() : 0;
  const latestUpdate = Math.max(batteryTime, moodTime);
  return latestUpdate > 0 && now - latestUpdate < RECENT_UPDATE_GRACE_MS;
}

function isAutoArchived(checkIn: MyCheckIn): boolean {
  const now = Date.now();
  const batteryTime = checkIn.battery_updated_at
    ? new Date(checkIn.battery_updated_at).getTime()
    : 0;
  const moodTime = checkIn.mood_updated_at ? new Date(checkIn.mood_updated_at).getTime() : 0;

  const batteryArchived =
    checkIn.social_battery === null || (batteryTime > 0 && now - batteryTime > AUTO_ARCHIVE_MS);
  const moodArchived = !checkIn.mood?.length || (moodTime > 0 && now - moodTime > AUTO_ARCHIVE_MS);

  return batteryArchived && moodArchived;
}

function isCooldownActive(userId: number): boolean {
  const ts = localStorage.getItem(getStorageKey(userId, 'dismissed'));
  if (!ts) return false;
  return Date.now() - Number(ts) < COOLDOWN_MS;
}

function saveInactiveTimestamp(userId: number) {
  localStorage.setItem(getStorageKey(userId, 'inactive'), String(Date.now()));
}

function getInactiveTimestamp(userId: number): number | null {
  const ts = localStorage.getItem(getStorageKey(userId, 'inactive'));
  return ts ? Number(ts) : null;
}

function saveDismissTimestamp(userId: number) {
  localStorage.setItem(getStorageKey(userId, 'dismissed'), String(Date.now()));
}

export function useCheckInFreshnessPrompt() {
  const [shouldShow, setShouldShow] = useState(false);
  const continuousTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTriggerRef = useRef(false);
  const trackEvent = useTrackEvent();

  const myProfile = useBoundStore((state) => state.myProfile);
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const checkIn = useBoundStore((state) => state.checkIn);
  const fetchCheckIn = useBoundStore((state) => state.fetchCheckIn);

  const userId = myProfile?.id;
  const checkInEnabled = featureFlags?.[FeatureFlagKey.CHECK_IN] ?? false;

  // 프롬프트 표시 가능 여부 확인
  const canShowPrompt = useCallback(() => {
    if (!checkInEnabled || !userId) return false;
    if (!hasActiveCheckIn(checkIn)) return false;
    if (checkIn && isRecentlyUpdated(checkIn)) return false;
    if (checkIn && isAutoArchived(checkIn)) return false;
    if (isCooldownActive(userId)) return false;
    return true;
  }, [checkInEnabled, userId, checkIn]);

  // 트리거 시도 (체크인 데이터 리프레시 후 판단)
  const tryTrigger = useCallback(async () => {
    if (!userId || !checkInEnabled) return;
    try {
      await fetchCheckIn();
    } catch {
      // 체크인 fetch 실패 시 무시
    }
    // fetchCheckIn 이후 state가 업데이트되면 canShowPrompt이 재평가됨
    pendingTriggerRef.current = true;
  }, [userId, checkInEnabled, fetchCheckIn]);

  // pendingTrigger가 있으면 canShowPrompt 재평가
  useEffect(() => {
    if (pendingTriggerRef.current) {
      pendingTriggerRef.current = false;
      if (canShowPrompt()) {
        setShouldShow(true);
        trackEvent('check_in_freshness_prompt_shown');
      }
    }
  }, [checkIn, canShowPrompt, trackEvent]);

  // 연속 사용 타이머 시작
  const startContinuousTimer = useCallback(() => {
    if (continuousTimerRef.current) {
      clearTimeout(continuousTimerRef.current);
    }
    continuousTimerRef.current = setTimeout(() => {
      tryTrigger();
    }, CONTINUOUS_USE_THRESHOLD_MS);
  }, [tryTrigger]);

  // 연속 사용 타이머 정지
  const stopContinuousTimer = useCallback(() => {
    if (continuousTimerRef.current) {
      clearTimeout(continuousTimerRef.current);
      continuousTimerRef.current = null;
    }
  }, []);

  // 앱이 다시 활성화될 때 처리
  const handleBecomeActive = useCallback(() => {
    if (!userId) return;
    const inactiveTs = getInactiveTimestamp(userId);
    if (inactiveTs && Date.now() - inactiveTs >= AWAY_THRESHOLD_MS) {
      tryTrigger();
    }
    startContinuousTimer();
  }, [userId, tryTrigger, startContinuousTimer]);

  // 앱이 비활성화될 때 처리
  const handleBecomeInactive = useCallback(() => {
    if (!userId) return;
    saveInactiveTimestamp(userId);
    stopContinuousTimer();
  }, [userId, stopContinuousTimer]);

  // SET_APP_STATE 메시지 수신을 위한 안정적 ref
  const handleBecomeActiveRef = useRef(handleBecomeActive);
  const handleBecomeInactiveRef = useRef(handleBecomeInactive);
  useEffect(() => {
    handleBecomeActiveRef.current = handleBecomeActive;
    handleBecomeInactiveRef.current = handleBecomeInactive;
  }, [handleBecomeActive, handleBecomeInactive]);

  // SET_APP_STATE 메시지 수신 (앱 → 웹)
  const handleAppState = useCallback((data: SetAppStateData) => {
    if (!data) return;
    if (data.value === 'active') {
      handleBecomeActiveRef.current();
    } else if (data.value === 'inactive' || data.value === 'background') {
      handleBecomeInactiveRef.current();
    }
  }, []);

  useGetAppMessage({ key: 'SET_APP_STATE', cb: handleAppState });

  // visibilitychange 이벤트 (데스크톱 웹 + 웹뷰 보조)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleBecomeActive();
      } else {
        handleBecomeInactive();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleBecomeActive, handleBecomeInactive]);

  // Cold start: 마운트 시 localStorage 확인 + 연속 사용 타이머 시작
  useEffect(() => {
    if (!userId || !checkInEnabled) return;

    const inactiveTs = getInactiveTimestamp(userId);
    if (inactiveTs && Date.now() - inactiveTs >= AWAY_THRESHOLD_MS) {
      tryTrigger();
    }

    startContinuousTimer();

    return () => {
      stopContinuousTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, checkInEnabled]);

  // dismiss 핸들러
  const dismiss = useCallback(() => {
    setShouldShow(false);
    trackEvent('check_in_freshness_prompt_dismissed');
    if (userId) {
      saveDismissTimestamp(userId);
    }
    startContinuousTimer();
  }, [userId, startContinuousTimer, trackEvent]);

  return { shouldShow, dismiss, checkIn };
}
