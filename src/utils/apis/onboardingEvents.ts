import axios from '@utils/apis/axios';

/**
 * Fire-and-forget POST that mirrors a Firebase Analytics event to the
 * backend's `OnboardingEvent` table so the wit_bot audit predicate can
 * detect engagement for features that don't otherwise touch the DB.
 *
 * Errors are swallowed silently — analytics mirroring should never break
 * a user-facing flow.
 */
export const logOnboardingEvent = async (eventKey: string, payload?: Record<string, unknown>) => {
  try {
    await axios.post('/chat/onboarding-events/', {
      event_key: eventKey,
      ...(payload ? { payload } : {}),
    });
  } catch {
    // Silent — analytics mirror is non-essential.
  }
};
