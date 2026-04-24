import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { useArchiveCounts } from '@hooks/useArchiveCounts';

/**
 * `[ All (N) | Pinned (M) ]` segmented chip rendered under the owner's
 * 2×2 check-in grid on the profile.
 *
 * Tapping either segment navigates to `/check-in/archive?tab=<value>`
 * so the archive screen opens pre-filtered. Counts are live-fetched
 * via {@link useArchiveCounts} (one cheap SWR key shared with the
 * archive screen's first-page cache).
 *
 * Filled no-border gray pills so the chips read as navigation
 * affordances distinct from the surrounding check-in cards (which use
 * the white-bg + gray-outline 8px-chip pattern). All and Pinned share
 * identical styling — the segmented control is a matched pair, and
 * the only difference between the two chips is the label + count.
 */
function CheckInArchiveChip() {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.segmented' });
  const navigate = useNavigate();
  const { archivedCount, pinnedCount } = useArchiveCounts();

  return (
    // 2px inter-segment gap so All Archived + Pinned read as a tight
    // matched pair distinct from the "Most Recent Check-In" title to
    // the left; the pair's far edge sits flush with the card's right
    // padding thanks to the parent justify-content=space-between.
    <Layout.FlexRow gap={2} alignItems="center">
      <Segment onClick={() => navigate('/check-in/archive?tab=all')}>
        {t('all')} ({archivedCount})
      </Segment>
      <Segment onClick={() => navigate('/check-in/archive?tab=pinned')}>
        {t('pinned')} ({pinnedCount})
      </Segment>
    </Layout.FlexRow>
  );
}

function Segment({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        padding: '3px 10px',
        lineHeight: 1.4,
        border: 'none',
        background: '#F5F5F5',
        cursor: 'pointer',
      }}
    >
      <Typo type="label-medium" color="PRIMARY" fontWeight={500}>
        {children}
      </Typo>
    </button>
  );
}

export default CheckInArchiveChip;
