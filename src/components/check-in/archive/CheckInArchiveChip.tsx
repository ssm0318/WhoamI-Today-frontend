import { useNavigate } from 'react-router-dom';
import FriendPinnedChip from '@components/friends/friend-pinned-chip/FriendPinnedChip';
import { Colors, Layout, Typo } from '@design-system';
import { useArchiveCounts } from '@hooks/useArchiveCounts';

function CheckInHistoryChip() {
  const navigate = useNavigate();
  const { historyCount, pinnedCount } = useArchiveCounts();

  return (
    <Layout.FlexRow gap={12} alignItems="center" style={{ flexShrink: 0 }}>
      <FriendPinnedChip pinnedCount={pinnedCount} to="/check-in/history?tab=pinned" />
      <Layout.FlexRow
        alignItems="center"
        gap={4}
        onClick={() => navigate('/check-in/history?tab=all')}
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
          style={{ color: Colors.PRIMARY }}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <Typo type="label-medium" color="PRIMARY" fontWeight={500} underline>
          History ({historyCount})
        </Typo>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default CheckInHistoryChip;
