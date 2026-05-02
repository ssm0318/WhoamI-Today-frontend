import { useCallback } from 'react';
import { usePostAppMessage } from './useAppMessage';

/**
 * Fire-and-forget Firebase Analytics event via the WebView bridge.
 *
 * The web frontend itself doesn't initialize the Firebase Analytics SDK
 * directly — it sends an `ANALYTICS_TRACK_EVENT` postMessage that the
 * native app forwards to `analytics().logEvent(...)` (see
 * WhoamI-Today-app/src/hooks/useWebView.ts and useAnalytics.tsx).
 *
 * Use this for behaviors that DON'T leave a backend trace and would
 * otherwise be invisible to research analytics — e.g. modal dismissals,
 * abandoned drafts, picker skip-rate, settings toggles. If the action
 * already mutates a backend model, query the model instead.
 *
 * In a non-app context (browser) the message is a no-op, which is
 * fine — the project is mobile-first and almost all users are in the
 * RN WebView.
 */
export const useTrackEvent = () => {
  const postAppMessage = usePostAppMessage();
  return useCallback(
    (name: string, params?: Record<string, string | number>) => {
      postAppMessage('ANALYTICS_TRACK_EVENT', {
        name,
        ...(params ? { params } : {}),
      });
    },
    [postAppMessage],
  );
};
