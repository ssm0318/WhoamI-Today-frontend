import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Colors, Layout, Typo } from '@design-system';
import { useArchiveCounts } from '@hooks/useArchiveCounts';

/**
 * `[ All (N) | Pinned (M) ]` segmented chip rendered under the owner's
 * 2×2 check-in grid on the profile.
 *
 * Tapping either segment navigates to `/check-in/archive?tab=<value>`
 * so the archive screen opens pre-filtered. Counts are live-fetched
 * via {@link useArchiveCounts} (one cheap SWR key shared with the
 * archive screen's first-page cache).
 */
function CheckInArchiveChip() {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.segmented' });
  const navigate = useNavigate();
  const { archivedCount, pinnedCount } = useArchiveCounts();

  return (
    <Layout.FlexRow gap={6} alignItems="center">
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
        borderRadius: 8,
        padding: '4px 8px',
        fontSize: 14,
        lineHeight: 1.4,
        border: `1px solid ${Colors.LIGHT_GRAY}`,
        background: Colors.WHITE,
        color: Colors.DARK_GRAY,
        cursor: 'pointer',
      }}
    >
      <Typo type="label-large" color="DARK_GRAY">
        {children}
      </Typo>
    </button>
  );
}

export default CheckInArchiveChip;
