import { useCallback, useEffect, useRef, useState } from 'react';
import { FeatureFlagKey } from '@constants/featureFlag';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { SetAppStateData } from '@models/app';
import { useBoundStore } from '@stores/useBoundStore';

const AWAY_THRESHOLD_MS = 30 * 60 * 1000; // 30 min — anything shorter is "same session"
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown after the user dismisses the prompt

function getStorageKey(userId: number, suffix: string) {
  return `browse_mode_${suffix}_${userId}`;
}

function isCooldownActive(userId: number): boolean {
  const ts = localStorage.getItem(getStorageKey(userId, 'dismissed'));
  if (!ts) return false;
  return Date.now() - Number(ts) < COOLDOWN_MS;
}

function saveLastSessionTimestamp(userId: number) {
  localStorage.setItem(getStorageKey(userId, 'last_session'), String(Date.now()));
}

function getLastSessionTimestamp(userId: number): number | null {
  const ts = localStorage.getItem(getStorageKey(userId, 'last_session'));
  return ts ? Number(ts) : null;
}

function saveDismissTimestamp(userId: number) {
  localStorage.setItem(getStorageKey(userId, 'dismissed'), String(Date.now()));
}

/**
 * On a new session — meaning the user has been away for at least 30 minutes —
 * surface the two-step Browse Mode prompt. Quick re-opens (close → reopen
 * within 30 min) are intentionally treated as the same session and skipped.
 *
 * Mirrors the structure of `useCheckInFreshnessPrompt`: visibilitychange
 * listener + native SET_APP_STATE bridge + per-user localStorage timestamps.
 */
export function useBrowseModeSessionPrompt() {
  const [shouldShow, setShouldShow] = useState(false);

  const myProfile = useBoundStore((state) => state.myProfile);
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const fetchPresets = useBoundStore((state) => state.fetchCustomBrowseModePresets);

  const userId = myProfile?.id;
  const browseModeEnabled = featureFlags?.[FeatureFlagKey.BROWSE_MODE] ?? false;

  const tryTrigger = useCallback(() => {
    if (!userId || !browseModeEnabled) return;
    if (isCooldownActive(userId)) return;
    setShouldShow(true);
  }, [userId, browseModeEnabled]);

  // Stable refs so the SET_APP_STATE callback doesn't re-bind every render.
  const handleBecomeActive = useCallback(() => {
    if (!userId) return;
    const lastTs = getLastSessionTimestamp(userId);
    if (lastTs && Date.now() - lastTs >= AWAY_THRESHOLD_MS) {
      tryTrigger();
    }
  }, [userId, tryTrigger]);

  const handleBecomeInactive = useCallback(() => {
    if (!userId) return;
    saveLastSessionTimestamp(userId);
  }, [userId]);

  const handleBecomeActiveRef = useRef(handleBecomeActive);
  const handleBecomeInactiveRef = useRef(handleBecomeInactive);
  useEffect(() => {
    handleBecomeActiveRef.current = handleBecomeActive;
    handleBecomeInactiveRef.current = handleBecomeInactive;
  }, [handleBecomeActive, handleBecomeInactive]);

  const handleAppState = useCallback((data: SetAppStateData) => {
    if (!data) return;
    if (data.value === 'active') {
      handleBecomeActiveRef.current();
    } else if (data.value === 'inactive' || data.value === 'background') {
      handleBecomeInactiveRef.current();
    }
  }, []);

  useGetAppMessage({ key: 'SET_APP_STATE', cb: handleAppState });

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleBecomeActive();
      } else {
        handleBecomeInactive();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [handleBecomeActive, handleBecomeInactive]);

  // Cold start: prompt on first-ever visit AND on returns after 30+ min away.
  // Also load saved presets so they're ready when the prompt opens.
  useEffect(() => {
    if (!userId || !browseModeEnabled) return;

    const lastTs = getLastSessionTimestamp(userId);
    if (lastTs === null || Date.now() - lastTs >= AWAY_THRESHOLD_MS) {
      tryTrigger();
    }
    fetchPresets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, browseModeEnabled]);

  const dismiss = useCallback(() => {
    setShouldShow(false);
    if (userId) {
      saveDismissTimestamp(userId);
      saveLastSessionTimestamp(userId);
    }
  }, [userId]);

  /**
   * Like `dismiss`, but called after the user actively chose a mode.
   * Skips the dismiss-cooldown so the next 30-min-away gap re-prompts as expected.
   */
  const finish = useCallback(() => {
    setShouldShow(false);
    if (userId) {
      saveLastSessionTimestamp(userId);
    }
  }, [userId]);

  /** Manually open the prompt (e.g., from the header indicator chip). */
  const open = useCallback(() => {
    setShouldShow(true);
  }, []);

  return { shouldShow, dismiss, finish, open };
}
