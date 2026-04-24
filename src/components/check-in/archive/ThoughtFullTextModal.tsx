import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { CheckInComponentEntry } from '@models/checkInEntry';
import { formatEntryTimestamp } from '@utils/archiveHelpers';

interface Props {
  entry: CheckInComponentEntry | null;
  onClose: () => void;
}

/**
 * Read-only modal surfacing a thought entry's full text.
 *
 * Thought cards in the 2-col grid clamp to 4 lines; tapping one opens
 * this modal with the complete string + a relative timestamp. No edit
 * affordances — modifying content happens on the live Check-In tab,
 * not in the archive.
 */
function ThoughtFullTextModal({ entry, onClose }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.thought_modal' });
  const isOpen = entry !== null && entry.component === 'thought';
  const data = (entry?.data ?? {}) as { thought?: string };

  return (
    <BottomModal visible={isOpen} onClose={onClose}>
      <Layout.FlexCol w="100%" p={DEFAULT_MARGIN} gap={12}>
        {entry && (
          <Typo type="label-small" color="MEDIUM_GRAY">
            {formatEntryTimestamp(entry.created_at)}
          </Typo>
        )}
        <div style={{ wordBreak: 'break-word' }}>
          <Typo type="body-large" color="DARK">
            {data.thought ?? ''}
          </Typo>
        </div>
        <Layout.FlexRow w="100%" justifyContent="flex-end">
          <button
            type="button"
            onClick={onClose}
            style={{
              border: `1px solid ${Colors.LIGHT_GRAY}`,
              borderRadius: 8,
              background: Colors.WHITE,
              padding: '6px 12px',
              fontSize: 14,
              color: Colors.DARK_GRAY,
              cursor: 'pointer',
            }}
          >
            {t('close')}
          </button>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default ThoughtFullTextModal;
