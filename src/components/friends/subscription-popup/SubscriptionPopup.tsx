import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditorPopup from '@components/check-in/update-quadrant/EditorPopup';
import { CheckBox, Layout, Typo } from '@design-system';
import { useSubscriptions } from '@hooks/useSubscriptions';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { VersionType } from '@models/api/user';
import {
  SubscriptionType,
  VER_Q_SUBSCRIPTION_TYPES,
  VER_W_SUBSCRIPTION_TYPES,
} from '@models/subscription';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  friendId: number;
  username?: string;
  currentVersion?: VersionType | null;
  onSubscriptionChange?: (hasSubscription: boolean) => void;
}

function SubscriptionPopup({
  isOpen,
  onClose,
  friendId,
  username,
  currentVersion,
  onSubscriptionChange,
}: SubscriptionPopupProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'subscription_popup' });

  const availableTypes =
    currentVersion === VersionType.VER_Q ? VER_Q_SUBSCRIPTION_TYPES : VER_W_SUBSCRIPTION_TYPES;

  const { types, save, isSaving } = useSubscriptions({ friendId, enabled: isOpen });
  const [draft, setDraft] = useState<SubscriptionType[]>([]);
  const trackEvent = useTrackEvent();
  // Tracks the BEFORE state when the popup opens, so we can tell whether
  // a save was actually a change vs a no-op confirm. savedRef flips on
  // successful save so the close path knows whether to fire abandoned.
  const beforeStateRef = useRef<SubscriptionType[]>([]);
  const savedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(types);
      beforeStateRef.current = types;
      savedRef.current = false;
      trackEvent('subscription_popup_opened', { friend_id: friendId });
    } else if (!savedRef.current && beforeStateRef.current.length === 0 && draft.length === 0) {
      // Closed without save AND no fiddle. Skip the noisy abandoned event
      // for purely-passive opens.
    } else if (!savedRef.current) {
      trackEvent('subscription_popup_dismissed', {
        friend_id: friendId,
        had_changes:
          JSON.stringify([...draft].sort()) !== JSON.stringify([...beforeStateRef.current].sort())
            ? 'true'
            : 'false',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, types]);

  const toggleType = (type: SubscriptionType) => {
    setDraft((prev) => {
      const next = prev.includes(type) ? prev.filter((p) => p !== type) : [...prev, type];
      trackEvent('subscription_type_toggled', {
        friend_id: friendId,
        type,
        value: next.includes(type) ? 'on' : 'off',
      });
      return next;
    });
  };

  const handleShare = async () => {
    if (isSaving) return;
    await save(draft);
    savedRef.current = true;
    trackEvent('subscription_popup_saved', {
      friend_id: friendId,
      type_count: draft.length,
    });
    onSubscriptionChange?.(draft.length > 0);
    onClose();
  };

  const title = username ? t('title_with_user', { username }) : t('title');

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} onShare={handleShare} title={title}>
      <Layout.FlexCol w="100%" gap={4} mb={12}>
        <Typo type="body-medium" color="DARK_GRAY">
          {t('description')}
        </Typo>
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" gap={12}>
        {availableTypes.map((type) => (
          <CheckBox
            key={type}
            name={t(`type.${type}`) || type}
            checked={draft.includes(type)}
            onChange={() => toggleType(type)}
          />
        ))}
      </Layout.FlexCol>
    </EditorPopup>
  );
}

export default SubscriptionPopup;
