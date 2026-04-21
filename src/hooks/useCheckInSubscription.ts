import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '@stores/useBoundStore';
import { subscribeCheckIn, unsubscribeCheckIn } from '@utils/apis/friends';

interface UseCheckInSubscriptionParams {
  userId?: number;
  initialSubscribed?: boolean;
  onChange?: (next: boolean) => void;
}

export function useCheckInSubscription({
  userId,
  initialSubscribed,
  onChange,
}: UseCheckInSubscriptionParams) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_subscription.toast' });
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [isSubscribed, setIsSubscribed] = useState<boolean>(!!initialSubscribed);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsSubscribed(!!initialSubscribed);
  }, [initialSubscribed]);

  const toggle = useCallback(async () => {
    if (!userId || isPending) return;
    const next = !isSubscribed;

    setIsPending(true);
    setIsSubscribed(next);

    try {
      if (next) {
        await subscribeCheckIn(userId);
      } else {
        await unsubscribeCheckIn(userId);
      }
      openToast({ message: t(next ? 'subscribed' : 'unsubscribed') });
      onChange?.(next);
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      const status = err.response?.status;
      const alreadyInTargetState =
        (next && status === 400 && err.response?.data?.error?.includes('Already subscribed')) ||
        (!next && status === 404);

      if (alreadyInTargetState) {
        openToast({ message: t(next ? 'subscribed' : 'unsubscribed') });
        onChange?.(next);
      } else {
        setIsSubscribed(!next);
        openToast({ message: t('error') });
      }
    } finally {
      setIsPending(false);
    }
  }, [userId, isPending, isSubscribed, openToast, t, onChange]);

  return { isSubscribed, isPending, toggle };
}
