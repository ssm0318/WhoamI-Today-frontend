import { CSSProperties, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Colors, SvgIcon, Typo } from '@design-system';

interface Props {
  username: string;
  /** Viewer-visible pinned count from FriendListSerializer.pinned_count. */
  pinnedCount: number;
}

/**
 * `📌 Pinned Check-ins (N)` chip surfaced inline on each friend's card
 * and on the friend profile's Most Recent Check-In row.
 *
 * Visible only when the friend has at least one pin visible to this
 * viewer (N > 0 per the backend's visibility filter). Tapping navigates
 * to the read-only friend pinned feed; the outer card click handler is
 * short-circuited via stopPropagation so users don't get accidentally
 * dropped on the profile page.
 *
 * The leading pin icon reinforces recognition when the chip sits next
 * to other pill-shaped affordances (friend status badges, new-post
 * badges, last-updated timestamps) on a dense card.
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
      <SvgIcon name="pin_filled" size={14} color="PRIMARY" />
      <Typo type="label-medium" color="DARK_GRAY">
        {t('pinned_count', { count: pinnedCount })}
      </Typo>
    </button>
  );
}

const buttonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
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
