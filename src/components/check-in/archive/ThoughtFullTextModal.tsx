import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
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
  const isOpen = entry !== null && entry.component === 'thought';
  const data = (entry?.data ?? {}) as { thought?: string };

  return (
    <BottomModal
      visible={isOpen}
      onClose={onClose}
      draggable
      customHeight={Math.round(SCREEN_HEIGHT * 0.55)}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#FCFCFC',
          borderBottom: '1px solid #F0F0F0',
          padding: '16px 0',
        }}
      />
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
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default ThoughtFullTextModal;
