import { useNavigate } from 'react-router-dom';
import FriendPinnedChip from '@components/friends/friend-pinned-chip/FriendPinnedChip';
import { Layout, Typo } from '@design-system';
import { useArchiveCounts } from '@hooks/useArchiveCounts';

function CheckInArchiveChip() {
  const navigate = useNavigate();
  const { archivedCount, pinnedCount } = useArchiveCounts();

  return (
    <Layout.FlexRow gap={12} alignItems="center" style={{ flexShrink: 0 }}>
      <Layout.FlexRow
        alignItems="center"
        gap={4}
        onClick={() => navigate('/check-in/archive?tab=all')}
        style={{ cursor: 'pointer' }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ color: '#8C8C8C' }}
        >
          <rect x="3" y="3" width="18" height="5" rx="1" />
          <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
          <path d="M10 12h4" />
        </svg>
        <Typo type="label-medium" color="DARK_GRAY" underline>
          Archive ({archivedCount})
        </Typo>
      </Layout.FlexRow>
      <FriendPinnedChip pinnedCount={pinnedCount} to="/check-in/archive?tab=pinned" />
    </Layout.FlexRow>
  );
}

export default CheckInArchiveChip;
