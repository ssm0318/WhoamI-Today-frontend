import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import VisibilityToggle, {
  getVisibilityLabel,
} from '@components/check-in/visibility-toggle/VisibilityToggle';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import { CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
import BatteryCardBody from './BatteryCardBody';
import MoodCardBody from './MoodCardBody';
import SongCardBody from './SongCardBody';
import ThoughtCardBody from './ThoughtCardBody';

interface Props {
  entry: CheckInComponentEntry | null;
  onClose: () => void;
  onConfirm: (entry: CheckInComponentEntry, visibility: ComponentVisibility) => void;
}

/**
 * Confirmation modal shown when the user taps pin on a history entry.
 * Displays the entry's original visibility and lets the user confirm
 * or change it before pinning.
 */
function PinConfirmModal({ entry, onClose, onConfirm }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'history.pin_confirm' });
  const [selected, setSelected] = useState<ComponentVisibility>(ComponentVisibility.FRIENDS);

  useEffect(() => {
    if (!entry) return;
    setSelected(entry.visibility as ComponentVisibility);
  }, [entry]);

  const handleConfirm = () => {
    if (!entry) return;
    onConfirm(entry, selected);
    onClose();
  };

  return (
    <BottomModal visible={entry !== null} onClose={onClose} draggable>
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('title')}
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.FlexCol w="100%" p={DEFAULT_MARGIN} gap={16}>
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

        {entry && (
          <Typo type="body-medium" color="DARK_GRAY">
            {t('message', {
              visibility: getVisibilityLabel(entry.visibility as ComponentVisibility),
            })}
          </Typo>
        )}

        <VisibilityToggle value={selected} onChange={setSelected} />

        <Layout.FlexRow w="100%" gap={8}>
          <button type="button" onClick={onClose} style={cancelButtonStyle}>
            <Typo type="button-medium" color="DARK_GRAY">
              {t('cancel')}
            </Typo>
          </button>
          <button type="button" onClick={handleConfirm} style={confirmButtonStyle}>
            <Typo type="button-medium" color="BLACK">
              {t('confirm')}
            </Typo>
          </button>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </BottomModal>
  );
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
  padding: '12px 14px',
  background: '#F5F5F5',
  border: 'none',
  cursor: 'pointer',
  flex: 1,
};

const confirmButtonStyle: CSSProperties = {
  borderRadius: 8,
  padding: '12px 14px',
  background: Colors.SECONDARY,
  border: 'none',
  cursor: 'pointer',
  flex: 1,
};

export default PinConfirmModal;
