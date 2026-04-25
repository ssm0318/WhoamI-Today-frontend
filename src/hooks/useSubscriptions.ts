import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubscriptionType } from '@models/subscription';
import { useBoundStore } from '@stores/useBoundStore';
import { getSubscriptions, updateSubscriptions } from '@utils/apis/subscription';

interface UseSubscriptionsParams {
  friendId?: number;
  enabled?: boolean;
}

export function useSubscriptions({ friendId, enabled = true }: UseSubscriptionsParams) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_subscription.toast' });
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [types, setTypes] = useState<SubscriptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!friendId || !enabled) return;
    let cancelled = false;
    setIsLoading(true);
    getSubscriptions(friendId)
      .then((next) => {
        if (!cancelled) setTypes(next);
      })
      .catch(() => {
        if (!cancelled) setTypes([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [friendId, enabled]);

  const save = useCallback(
    async (nextTypes: SubscriptionType[]) => {
      if (!friendId || isSaving) return;
      const previous = types;
      setIsSaving(true);
      setTypes(nextTypes);
      try {
        const saved = await updateSubscriptions(friendId, nextTypes);
        setTypes(saved);
        openToast({ message: t(nextTypes.length > 0 ? 'subscribed' : 'unsubscribed') });
      } catch (e) {
        setTypes(previous);
        openToast({ message: t('error') });
      } finally {
        setIsSaving(false);
      }
    },
    [friendId, isSaving, types, openToast, t],
  );

  return { types, isLoading, isSaving, save };
}
