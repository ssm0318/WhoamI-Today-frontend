import { useCallback, useEffect, useState } from 'react';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout } from '@design-system';
import { ComponentVisibility, SocialBattery } from '@models/checkIn';
import {
  getLastVisibility,
  setLastVisibility,
  VisibilityMemoryKeys,
} from '@utils/visibilityMemory';
import EditorPopup from './EditorPopup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: (value: SocialBattery | null, visibility: ComponentVisibility) => void;
  onArchive?: () => void;
  value: SocialBattery | null;
  onChange: (value: SocialBattery | null) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

const BATTERY_OPTIONS = Object.values(SocialBattery);

export default function BatteryEditor({
  isOpen,
  onClose,
  onShare,
  onArchive,
  value,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  const [draftValue, setDraftValue] = useState<SocialBattery | null>(value);
  const [draftVisibility, setDraftVisibility] = useState<ComponentVisibility>(
    () => getLastVisibility(VisibilityMemoryKeys.checkInBattery) ?? visibility,
  );

  useEffect(() => {
    if (isOpen) {
      setDraftValue(value);
      // Default to user's last picked visibility for this content type, falling
      // back to the parent-supplied default for the very first share.
      setDraftVisibility(getLastVisibility(VisibilityMemoryKeys.checkInBattery) ?? visibility);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleVisibilityChange = useCallback((v: ComponentVisibility) => {
    setDraftVisibility(v);
    setLastVisibility(VisibilityMemoryKeys.checkInBattery, v);
  }, []);

  const handleShare = useCallback(() => {
    onChange(draftValue);
    onVisibilityChange(draftVisibility);
    onShare(draftValue, draftVisibility);
  }, [draftValue, draftVisibility, onChange, onVisibilityChange, onShare]);

  return (
    <EditorPopup
      isOpen={isOpen}
      onClose={onClose}
      onShare={handleShare}
      onArchive={onArchive}
      title="Social Battery"
    >
      <Layout.FlexRow w="100%" gap={8} mb={16} style={{ flexWrap: 'wrap' }}>
        {BATTERY_OPTIONS.map((battery) => (
          <SocialBatteryChip
            key={battery}
            socialBattery={battery}
            isSelected={draftValue === battery}
            onSelect={(b) => setDraftValue(draftValue === b ? null : b)}
          />
        ))}
      </Layout.FlexRow>
      <VisibilityToggle value={draftVisibility} onChange={handleVisibilityChange} />
    </EditorPopup>
  );
}
