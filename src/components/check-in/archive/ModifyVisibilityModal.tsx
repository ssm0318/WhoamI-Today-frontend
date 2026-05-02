import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import { CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
import { setLastVisibility, VisibilityMemoryKeys } from '@utils/visibilityMemory';
import BatteryCardBody from './BatteryCardBody';
import MoodCardBody from './MoodCardBody';
import SongCardBody from './SongCardBody';
import ThoughtCardBody from './ThoughtCardBody';

interface Props {
  entry: CheckInComponentEntry | null;
  onClose: () => void;
  onConfirm: (visibility: ComponentVisibility) => Promise<void> | void;
}

/**
 * Modify-visibility modal for a pinned archive entry.
 *
 * Mirrors the live check-in update popups: a read-only preview of the
 * component sits at the top, followed by the 4-way text-only
 * {@link VisibilityToggle}. Content is frozen — edits happen on the
 * live Check-In tab, not here. Save hits PATCH /entries/<pk>/pin_visibility/
 * via the caller; cancel dismisses without a request.
 *
 * Only opens for pinned entries (gated at the `⋯` menu level) — so the
 * initial value is always read from `pin_visibility`, never from the
 * entry's frozen `visibility`.
 */
function ModifyVisibilityModal({ entry, onClose, onConfirm }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.visibility_modal' });
  const [selected, setSelected] = useState<ComponentVisibility>(ComponentVisibility.FRIENDS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!entry) return;
    setSelected(
      (entry.pin_visibility as ComponentVisibility | null) ??
        (entry.visibility as ComponentVisibility),
    );
  }, [entry]);

  const handleSave = async () => {
    if (!entry || saving) return;
    setSaving(true);
    try {
      await onConfirm(selected);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomModal visible={entry !== null} onClose={onClose}>
      <Layout.FlexCol w="100%" p={DEFAULT_MARGIN} gap={16}>
        <Typo type="title-medium" color="DARK">
          {t('title')}
        </Typo>

        {/* Read-only preview of the component being shared. */}
        {entry && (
          <Layout.FlexCol
            w="100%"
            alignItems="center"
            justifyContent="center"
            p={12}
            rounded={8}
            outline="LIGHT_GRAY"
            style={{ minHeight: 120 }}
          >
            {renderPreview(entry)}
          </Layout.FlexCol>
        )}

        <Layout.FlexCol w="100%" gap={8}>
          <Typo type="label-medium" color="MEDIUM_GRAY">
            {t('visibility_label')}
          </Typo>
          <VisibilityToggle
            value={selected}
            onChange={(v) => {
              setSelected(v);
              if (entry) {
                const key = memoryKeyForComponent(entry.component);
                if (key) setLastVisibility(key, v);
              }
            }}
          />
        </Layout.FlexCol>

        <Layout.FlexRow w="100%" justifyContent="flex-end" gap={8}>
          <button type="button" onClick={onClose} style={cancelButtonStyle} disabled={saving}>
            <Typo type="button-medium" color="DARK_GRAY">
              {t('cancel')}
            </Typo>
          </button>
          <button type="button" onClick={handleSave} style={saveButtonStyle} disabled={saving}>
            <Typo type="button-medium" color="WHITE">
              {t('save')}
            </Typo>
          </button>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </BottomModal>
  );
}

function memoryKeyForComponent(component: ComponentType): string | null {
  switch (component) {
    case ComponentType.BATTERY:
      return VisibilityMemoryKeys.checkInBattery;
    case ComponentType.MOOD:
      return VisibilityMemoryKeys.checkInMood;
    case ComponentType.SONG:
      return VisibilityMemoryKeys.checkInSong;
    case ComponentType.THOUGHT:
      return VisibilityMemoryKeys.checkInThought;
    default:
      return null;
  }
}

function renderPreview(entry: CheckInComponentEntry) {
  switch (entry.component) {
    case ComponentType.BATTERY:
      return <BatteryCardBody entry={entry} />;
    case ComponentType.MOOD:
      return <MoodCardBody entry={entry} />;
    case ComponentType.THOUGHT:
      return <ThoughtCardBody entry={entry} />;
    case ComponentType.SONG:
      return <SongCardBody entry={entry} />;
    default:
      return null;
  }
}

const cancelButtonStyle: CSSProperties = {
  borderRadius: 8,
  padding: '6px 14px',
  background: Colors.WHITE,
  border: `1px solid ${Colors.LIGHT_GRAY}`,
  cursor: 'pointer',
};

const saveButtonStyle: CSSProperties = {
  borderRadius: 8,
  padding: '6px 14px',
  background: Colors.PRIMARY,
  border: 'none',
  cursor: 'pointer',
};

export default ModifyVisibilityModal;
