import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditorPopup from '@components/check-in/update-quadrant/EditorPopup';
import { CheckBox, Layout, Typo } from '@design-system';
import { useSubscriptions } from '@hooks/useSubscriptions';
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

  useEffect(() => {
    if (isOpen) setDraft(types);
  }, [isOpen, types]);

  const toggleType = (type: SubscriptionType) => {
    setDraft((prev) => (prev.includes(type) ? prev.filter((p) => p !== type) : [...prev, type]));
  };

  const handleShare = async () => {
    if (isSaving) return;
    await save(draft);
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
