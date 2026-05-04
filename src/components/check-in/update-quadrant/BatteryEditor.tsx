import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ArchiveAfter24hToggle from '@components/check-in/archive-toggle/ArchiveAfter24hToggle';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { ComponentVisibility, SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import {
  getLastVisibility,
  setLastVisibility,
  VisibilityMemoryKeys,
} from '@utils/visibilityMemory';
import EditorPopup from './EditorPopup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: (
    value: SocialBattery | null,
    visibility: ComponentVisibility,
    archiveAfter24h: boolean,
  ) => void;
  value: SocialBattery | null;
  onChange: (value: SocialBattery | null) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
  archiveAfter24h: boolean;
  onArchiveAfter24hChange: (next: boolean) => void;
}

const BATTERY_OPTIONS = Object.values(SocialBattery);

export default function BatteryEditor({
  isOpen,
  onClose,
  onShare,
  value,
  onChange,
  visibility,
  onVisibilityChange,
  archiveAfter24h,
  onArchiveAfter24hChange,
}: Props) {
  const [draftValue, setDraftValue] = useState<SocialBattery | null>(value);
  const [draftVisibility, setDraftVisibility] = useState<ComponentVisibility>(
    () => getLastVisibility(VisibilityMemoryKeys.checkInBattery) ?? visibility,
  );
  const [draftArchive, setDraftArchive] = useState<boolean>(archiveAfter24h);
  const openToast = useBoundStore((state) => state.openToast);

  // Snapshot of value/visibility/archive at popup open — used to skip the share
  // entirely when the user taps Confirm without changing anything.
  const initialValueRef = useRef<SocialBattery | null>(value);
  const initialVisibilityRef = useRef<ComponentVisibility>(
    getLastVisibility(VisibilityMemoryKeys.checkInBattery) ?? visibility,
  );
  const initialArchiveRef = useRef<boolean>(archiveAfter24h);

  useEffect(() => {
    if (isOpen) {
      // Default to user's last picked visibility for this content type, falling
      // back to the parent-supplied default for the very first share.
      const initialVis = getLastVisibility(VisibilityMemoryKeys.checkInBattery) ?? visibility;
      setDraftValue(value);
      setDraftVisibility(initialVis);
      setDraftArchive(archiveAfter24h);
      initialValueRef.current = value;
      initialVisibilityRef.current = initialVis;
      initialArchiveRef.current = archiveAfter24h;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleVisibilityChange = useCallback((v: ComponentVisibility) => {
    setDraftVisibility(v);
    setLastVisibility(VisibilityMemoryKeys.checkInBattery, v);
  }, []);

  const handleShare = useCallback(() => {
    if (
      draftValue === initialValueRef.current &&
      draftVisibility === initialVisibilityRef.current &&
      draftArchive === initialArchiveRef.current
    ) {
      openToast({ message: 'No changes' });
      onClose();
      return;
    }
    onChange(draftValue);
    onVisibilityChange(draftVisibility);
    onArchiveAfter24hChange(draftArchive);
    onShare(draftValue, draftVisibility, draftArchive);
  }, [
    draftValue,
    draftVisibility,
    draftArchive,
    onChange,
    onVisibilityChange,
    onArchiveAfter24hChange,
    onShare,
    onClose,
    openToast,
  ]);

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} onShare={handleShare} title="Social Battery">
      <Layout.FlexRow w="100%" gap={8} mb={8} style={{ flexWrap: 'wrap' }}>
        {BATTERY_OPTIONS.map((battery) => (
          <SocialBatteryChip
            key={battery}
            socialBattery={battery}
            isSelected={draftValue === battery}
            onSelect={(b) => setDraftValue(draftValue === b ? null : b)}
          />
        ))}
      </Layout.FlexRow>
      {draftValue && (
        <Layout.FlexRow w="100%" justifyContent="flex-end" mb={16}>
          <ClearButton type="button" onClick={() => setDraftValue(null)}>
            <SvgIcon name="close" size={14} color="MEDIUM_GRAY" />
            <Typo type="label-medium" color="MEDIUM_GRAY">
              Clear
            </Typo>
          </ClearButton>
        </Layout.FlexRow>
      )}
      <VisibilityToggle value={draftVisibility} onChange={handleVisibilityChange} />
      <ArchiveAfter24hToggle checked={draftArchive} onChange={setDraftArchive} />
    </EditorPopup>
  );
}

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px 6px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${Colors.LIGHT};
  }
`;
