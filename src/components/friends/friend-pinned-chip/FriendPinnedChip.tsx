import { CSSProperties, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Colors, Typo } from '@design-system';

interface Props {
  username: string;
  /** Viewer-visible pinned count from FriendListSerializer.pinned_count. */
  pinnedCount: number;
}

/**
 * `Pinned Check-ins (N)` chip surfaced inline on each friend's card.
 *
 * Visible only when the friend has at least one pin visible to this
 * viewer (N > 0 per the backend's visibility filter). Tapping
 * navigates to the read-only friend pinned feed; the outer friend-card
 * click handler is short-circuited via stopPropagation so users
 * don't get accidentally dropped on the profile page.
 */
function FriendPinnedChip({ username, pinnedCount }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.friend_card' });
  const navigate = useNavigate();

  if (pinnedCount <= 0) return null;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${username}/check-in/pinned`);
  };

  return (
    <button type="button" onClick={handleClick} style={buttonStyle}>
      <Typo type="label-medium" color="DARK_GRAY">
        {t('pinned_count', { count: pinnedCount })}
      </Typo>
    </button>
  );
}

const buttonStyle: CSSProperties = {
  borderRadius: 8,
  padding: '2px 8px',
  fontSize: 12,
  lineHeight: 1.4,
  border: `1px solid ${Colors.LIGHT_GRAY}`,
  background: Colors.WHITE,
  cursor: 'pointer',
  flexShrink: 0,
};

export default FriendPinnedChip;
